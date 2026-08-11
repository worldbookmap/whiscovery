import { Client } from "@notionhq/client";
import { getCollectionByKey } from "@/lib/collections";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const listCache = new Map();
const detailCache = new Map();
const CACHE_TTL_MS = 60_000;

const getCachedValue = (cache, key) => {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }

  return entry.value;
};

const setCachedValue = (cache, key, value) => {
  cache.set(key, {
    value,
    timestamp: Date.now(),
  });
};

const richTextToPlain = (field) => {
  if (!field || !Array.isArray(field) || field.length === 0) return "";
  return field.map((item) => item.plain_text).join("");
};

const titleToPlain = (field) => {
  if (!field || !Array.isArray(field) || field.length === 0) return "Untitled";
  return field.map((item) => item.plain_text).join("");
};

const parsePropertyValue = (property) => {
  if (!property) return "";

  switch (property.type) {
    case "title":
      return titleToPlain(property.title);
    case "rich_text":
      return richTextToPlain(property.rich_text);
    case "number":
      return property.number;
    case "select":
      return property.select?.name || "";
    case "multi_select":
      return property.multi_select?.map((item) => item.name) || [];
    case "url":
      return property.url || "";
    case "date":
      return property.date?.start || "";
    case "files":
      return property.files || [];
    default:
      return "";
  }
};

const formatValue = (value) => {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "number") {
    return String(value);
  }

  return value || "";
};

const pickFirstPropertyByType = (properties, type) => {
  return Object.values(properties).find((property) => property.type === type);
};

const getPropertyForField = (properties, collection, field) => {
  if (properties[field.property]) {
    return properties[field.property];
  }

  if (collection.key === "db-4" && field.key === "kind") {
    return pickFirstPropertyByType(properties, "select");
  }

  if (collection.key === "db-4" && field.key === "origin") {
    return pickFirstPropertyByType(properties, "multi_select");
  }

  if (collection.key === "db-2" && field.key === "kind") {
    return properties["종류"] || pickFirstPropertyByType(properties, "multi_select");
  }

  if (field.key === "date") {
    return pickFirstPropertyByType(properties, "date");
  }

  return null;
};

const getImageUrl = (cover) => {
  if (!cover) return "";
  if (cover.type === "external") return cover.external?.url || "";
  if (cover.type === "file") return cover.file?.url || "";
  return "";
};

const normalizeImageUrl = (imageUrl, options = {}) => {
  if (!imageUrl) return "";

  const { width = 0, quality = 80 } = options;

  try {
    const url = new URL(imageUrl);
    const hasSignedAwsQuery = Array.from(url.searchParams.keys()).some((key) => key.toLowerCase().startsWith("x-amz-"));

    if (hasSignedAwsQuery) {
      return imageUrl;
    }

    const isNotionHosted = [
      "notion.so",
      "notion.site",
      "prod-files.secure",
      "secure.notion-static.com",
      "s3.us-west-2.amazonaws.com",
    ].some((hostname) => url.hostname.includes(hostname));

    if (isNotionHosted) {
      const searchParams = url.searchParams;
      searchParams.set("format", "webp");
      searchParams.set("quality", String(quality));

      if (width > 0) {
        searchParams.set("width", String(width));
      }

      return url.toString();
    }
  } catch (error) {
    return imageUrl;
  }

  return imageUrl;
};

const getFileUrl = (fileItem) => {
  if (!fileItem) return "";
  if (fileItem.type === "external") return fileItem.external?.url || "";
  if (fileItem.type === "file") return fileItem.file?.url || "";
  return "";
};

const looksLikeImageUrl = (value) => {
  if (!value || typeof value !== "string") return false;

  const trimmedValue = value.trim();
  if (!trimmedValue) return false;

  try {
    const url = new URL(trimmedValue);
    const pathname = url.pathname.toLowerCase();
    const extension = pathname.split(".").pop() || "";

    return ["png", "jpg", "jpeg", "gif", "webp", "svg", "avif", "bmp"].includes(extension) || url.hostname.includes("notion") || url.hostname.includes("amazonaws") || url.hostname.includes("images.unsplash") || trimmedValue.includes("image");
  } catch (error) {
    return false;
  }
};

const getPropertyImageUrl = (property) => {
  if (!property) return "";

  if (property.type === "files") {
    for (const fileItem of property.files || []) {
      const fileUrl = getFileUrl(fileItem);
      if (fileUrl && looksLikeImageUrl(fileUrl)) {
        return fileUrl;
      }
    }
  }

  if (property.type === "url") {
    const urlValue = property.url || "";
    if (looksLikeImageUrl(urlValue)) {
      return urlValue;
    }
  }

  if (property.type === "rich_text" || property.type === "title") {
    const plainValue = parsePropertyValue(property);
    if (looksLikeImageUrl(plainValue)) {
      return plainValue;
    }
  }

  return "";
};

const richTextToText = (richText) => {
  if (!Array.isArray(richText) || richText.length === 0) return "";
  return richText.map((item) => item.plain_text).join("");
};

const blockToContent = (block) => {
  switch (block.type) {
    case "paragraph":
      return { type: "paragraph", text: richTextToText(block.paragraph.rich_text) };
    case "heading_1":
      return { type: "heading", level: 1, text: richTextToText(block.heading_1.rich_text) };
    case "heading_2":
      return { type: "heading", level: 2, text: richTextToText(block.heading_2.rich_text) };
    case "heading_3":
      return { type: "heading", level: 3, text: richTextToText(block.heading_3.rich_text) };
    case "bulleted_list_item":
      return { type: "bullet", text: richTextToText(block.bulleted_list_item.rich_text) };
    case "numbered_list_item":
      return { type: "number", text: richTextToText(block.numbered_list_item.rich_text) };
    case "quote":
      return { type: "quote", text: richTextToText(block.quote.rich_text) };
    case "callout":
      return { type: "callout", text: richTextToText(block.callout.rich_text) };
    case "image":
      return {
        type: "image",
        url: block.image?.external?.url || block.image?.file?.url || "",
        caption: richTextToText(block.image?.caption || []),
      };
    default:
      return null;
  }
};

const getPageChildren = async (pageId, pageSize = 50) => {
  const response = await notion.blocks.children.list({
    block_id: pageId,
    page_size: pageSize,
  });

  return response.results || [];
};

const findFirstImageInBlocks = async (blocks) => {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return "";
  }

  for (const block of blocks) {
    if (!block) continue;

    if (block.type === "image") {
      return block.image?.external?.url || block.image?.file?.url || "";
    }

    if (block.has_children) {
      try {
        const childBlocks = await getPageChildren(block.id, 50);
        const nestedImage = await findFirstImageInBlocks(childBlocks);
        if (nestedImage) {
          return nestedImage;
        }
      } catch (error) {
        continue;
      }
    }
  }

  return "";
};

const getFirstImageFromPageBlocks = async (pageId) => {
  if (!pageId) return "";

  try {
    const blocks = await getPageChildren(pageId, 100);
    return findFirstImageInBlocks(blocks);
  } catch (error) {
    console.warn("Failed to read image blocks from Notion page:", error.message);
  }

  return "";
};

const getFirstImageFromPage = async (page) => {
  const coverImage = getImageUrl(page.cover);
  if (coverImage) return coverImage;

  for (const property of Object.values(page.properties || {})) {
    const propertyImageUrl = getPropertyImageUrl(property);
    if (propertyImageUrl) {
      return propertyImageUrl;
    }
  }

  return getFirstImageFromPageBlocks(page.id);
};

const getPageContentBlocks = async (pageId) => {
  const blocks = await getPageChildren(pageId, 100);
  return blocks.map(blockToContent).filter((block) => block && (block.text || block.url));
};

const getSearchableTextFromBlocks = (blocks) => {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return "";
  }

  return blocks
    .flatMap((block) => [block.text, block.caption].filter(Boolean))
    .join(" ")
    .trim();
};

const mapPageToCollectionItem = async (collection, page, options = {}) => {
  const { includeContentText = false } = options;
  const properties = page.properties || {};
  const titleProperty = properties[collection.titleProperty] || pickFirstPropertyByType(properties, "title");
  const title = formatValue(parsePropertyValue(titleProperty)) || "Untitled";

  const displayFields = collection.fields.map((field) => {
    const rawValue = parsePropertyValue(getPropertyForField(properties, collection, field));
    const formattedValue = formatValue(rawValue) || "미입력";

    return {
      key: field.key,
      label: field.label,
      value: formattedValue,
      rawValue,
    };
  });

  const filterRawValue = parsePropertyValue(properties[collection.filterProperty]);
  const filterValues = Array.isArray(filterRawValue) ? filterRawValue : filterRawValue ? [filterRawValue] : [];
  let contentText = "";
  if (includeContentText) {
    try {
      const contentBlocks = await getPageContentBlocks(page.id);
      contentText = getSearchableTextFromBlocks(contentBlocks);
    } catch (error) {
      contentText = "";
    }
  }

  const searchText = [title, ...displayFields.map((field) => field.value), ...filterValues, contentText].join(" ").toLowerCase();

  const firstImageUrl = await getFirstImageFromPage(page);

  return {
    id: page.id,
    title,
    url: page.url,
    imageUrl: normalizeImageUrl(firstImageUrl, { width: 240, quality: 70 }),
    displayFields,
    filterValues,
    searchText,
    contentText,
  };
};

const normalizeDatabaseId = (databaseId) => {
  if (!databaseId) return "";
  return databaseId.replace(/-/g, "").trim();
};

export const getConfiguredDatabaseIds = () => {
  const multipleIds = process.env.NOTION_DATABASE_IDS;
  if (multipleIds) {
    return multipleIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
  }

  return process.env.NOTION_DATABASE_ID ? [process.env.NOTION_DATABASE_ID] : [];
};

export const getWhiskyListByDatabaseId = async (databaseId, options = {}) => {
  const { includeContentText = false } = options;
  if (!process.env.NOTION_TOKEN) {
    throw new Error("NOTION_TOKEN 환경 변수가 비어 있습니다.");
  }

  const normalizedDatabaseId = normalizeDatabaseId(databaseId);
  if (!normalizedDatabaseId) {
    throw new Error("유효한 NOTION_DATABASE_ID가 필요합니다.");
  }

  const cacheKey = `list:${normalizedDatabaseId}:content:${includeContentText ? "1" : "0"}`;
  const cachedItems = getCachedValue(listCache, cacheKey);
  if (cachedItems) {
    return cachedItems;
  }

  const collection = ["db-1", "db-2", "db-3", "db-4"]
    .map((key) => getCollectionByKey(key))
    .find((entry) => normalizeDatabaseId(entry?.id) === normalizedDatabaseId);

  if (!collection) {
    throw new Error("해당 데이터베이스에 대한 컬렉션 설정을 찾지 못했습니다.");
  }

  const response = await notion.databases.query({
    database_id: normalizedDatabaseId,
    page_size: 100,
  });

  const items = await Promise.all(response.results.map((page) => mapPageToCollectionItem(collection, page, { includeContentText })));
  setCachedValue(listCache, cacheKey, items);

  return items;
};

export const getWhiskyItemDetail = async (databaseId, pageId) => {
  const normalizedDatabaseId = normalizeDatabaseId(databaseId);
  const cacheKey = `detail:${normalizedDatabaseId}:${pageId}`;
  const cachedItem = getCachedValue(detailCache, cacheKey);
  if (cachedItem) {
    return cachedItem;
  }

  const items = await getWhiskyListByDatabaseId(databaseId);
  const item = items.find((entry) => entry.id === pageId);

  if (!item) {
    return null;
  }

  const contentBlocks = await getPageContentBlocks(pageId);
  const detailItem = {
    ...item,
    contentBlocks,
  };

  setCachedValue(detailCache, cacheKey, detailItem);
  return detailItem;
};

export const getWhiskyList = async () => {
  const [firstDatabaseId] = getConfiguredDatabaseIds();
  if (!firstDatabaseId) {
    throw new Error("NOTION_DATABASE_ID 또는 NOTION_DATABASE_IDS 환경 변수가 비어 있습니다.");
  }

  return getWhiskyListByDatabaseId(firstDatabaseId);
};
