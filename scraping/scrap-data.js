const { eachOfLimit } =require("async");
const axios =require("axios");
const { writeFile } =require("fs/promises");

const scrapData = async () => {
  const { data } = await axios.get(
    "https://www.adidas.co.in/api/plp/content-engine?query=men-new_arrivals"
  );

  const items = data.raw.itemList.items.map((item) => ({
    availableSizes: item.availableSizes,
    category: item.category,
    colorVariations: item.colorVariations,
    name: item.displayName,
    image: item.image.src,
    modelId: item.modelId,
    price: item.price,
    productId: item.productId,
  }));
  await eachOfLimit(items, 10, async (item, i) => {
    item.variants = [];
    await eachOfLimit(item.colorVariations, 10, async (productId, j) => {
      try {
        const { data: variantData } = await axios.get(
          `https://www.adidas.co.in/api/search/product/${productId}`
          );
        item.variants.push({
          productId: variantData.id,
          color: variantData.color,
          image: variantData.image.src,
          modelId: variantData.modelId,
          price: variantData.price,
        });
      } catch (error) {}
    });
  });
  await writeFile("data.json", JSON.stringify(items, null, 2));
  return "true"
};

scrapData();
