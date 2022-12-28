const { writeFile } = require("fs/promises");
const axios = require("axios");

// writeStream.write("title","category","numberOfColors","price","imageUrl","\n");
const main = async () => {
  const { data } = await axios.get(
    "https://www.adidas.co.in/api/plp/content-engine?query=men-new_arrivals"
  );
  const items = data.raw.itemList.items;
  // console.log(items.length);
  const itemData = items.slice(0, 3).map(function (element) {
    return {
      title: element.subTitle,
      imgUrl: element.image.src,
      size: element.availableSizes,
      price: element.price,
      colorVariations: element.colorVariations,
    };
  });
  for (let i = 0; i < itemData.length; i++) {
    // if (!item) continue;
    const item = itemData[i];
    // console.log(item.colorVariations.length);
    if (item.colorVariations.length) {
      const variants = item.colorVariations;
      for (let j = 0; j < variants.length; j++) {
        // console.log(variants[j]);
        const { data: variantData } = await axios.get(
          "https://www.adidas.co.in/api/search/product/" + variants[j]
        );
        // if (variantData.message === "Product not found") continue;

        // console.log(variantData.error);
        variants[j] = {
          color: variantData.color,
          price: variantData.price,
          imgUrl: variantData.image.src,
          modelId: variantData.modelId,
          productId: variantData.productId,
        };
      }
    //   console.log(variants);
      await writeFile("productData.json", JSON.stringify(variants));
    }
  }
};

main();
