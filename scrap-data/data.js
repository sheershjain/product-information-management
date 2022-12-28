const cheerio = require("cheerio");
const { writeFile } = require("fs/promises");
const axios = require("axios");

// writeStream.write("title","category","numberOfColors","price","imageUrl","\n");
const main = async () => {
  const { data } = await axios.get(
    "https://www.adidas.co.in/api/plp/content-engine?query=men-new_arrivals"
  );
  const items = data.raw.itemList.items;
  // console.log(items.length);
  const itemData = items.slice(0,10).map(function (element) {
    return {
      title: element.subTitle,
      imgUrl: element.image.src,
      size: element.availableSizes,
      price: element.price,
      colorVariations: element.colorVariations,
    };
  });
  for (let i = 0; i < itemData.length; i++) {
    const item = itemData[i];
    if (item.colorVariations.length) {
      const variants = item.colorVariations;
      for (let j = 0; j < variants.length; j++) {
        const { data} = await axios.get(
          "https://www.adidas.co.in/api/search/product/" + variants[j]
          );
          console.log(data);
  //       // variants[j] = {
  //       //   color: variantData.color,
  //       //   price: variantData.price,
  //       //   imgUrl: variantData.image.src,
        };
      }
    }
  // for (int i = 0;i<)
  }

  // console.log(itemData, items.length);

  // console.log(imgUrl);

  // await writeFile("productData.json", JSON.stringify(productData));
// };

main();
