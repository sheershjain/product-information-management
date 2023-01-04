const models = require("../models");
const { readFile } = require("fs/promises");
const main = async () => {
  // const product = {
  //   availableSizes: ["11", "12", "7", "8", "9", "7.5", "8.5", "10", "9.5"],
  //   category: "shoes",
  //   colorVariations: ["H01878", "H01877"],
  //   name: "Samba Vegan Shoes",
  //   image:
  //     "https://assets.adidas.com/images/w_280,h_280,f_auto,q_auto:sensitive/508d2737737f40bbbd66ac5a0160e0e8_9366/samba-vegan-shoes.jpg",
  //   modelId: "LSS88",
  //   price: 8999,
  //   productId: "H01877",
  //   variants: [
  //     {
  //       productId: "H01877",
  //       color: "Cloud White / Core Black / Gum",
  //       image:
  //         "https://assets.adidas.com/images/w_280,h_280,f_auto,q_auto:sensitive/508d2737737f40bbbd66ac5a0160e0e8_9366/samba-vegan-shoes.jpg",
  //       modelId: "LSS88",
  //       price: 8999,
  //     },
  //     {
  //       productId: "H01878",
  //       color: "Cloud White / Core Black / Gum",
  //       image:
  //         "https://assets.adidas.com/images/w_280,h_280,f_auto,q_auto:sensitive/3a889f64f48a474cb87aac5a015f205c_9366/samba-vegan-shoes.jpg",
  //       modelId: "LSS88",
  //       price: 8999,
  //     },
  //   ],
  // };
  let product = await readFile("./data.json", { encoding: "utf8" });
  product = JSON.parse(product);
  try {
    const data = await product.map(async (product) => {
      const val = await models.Product.findOne({
        where: { sku_id: product.modelId },
      });

      let mainProduct = await models.Product.create({
        name: product.name,
        skuId: product.modelId,
        price: product.price,
      });

      let mainProductImage = await models.Media.create({
        productId: mainProduct.id,
        photoLink: product.image,
      });
      const childProducts = [];

      if (product.availableSizes.length) {
        let ProductVariationId = (
          await models.ProductVariation.findOne({
            where: { ProductVariationName: "size" },
          })
        )?.id;
        for (let i = 0; i < product.availableSizes.length; i++) {
          const avlSize = product.availableSizes[i];
          if (avlSize) {
            if (!mainProduct.MatrixProduct) {
              mainProduct.set({
                MatrixProduct: true,
              });
              mainProduct = await mainProduct.save();
            }
            let size = (
              await models.ProductVariationData.findOne({
                where: {
                  DataValue: avlSize,
                  ProductVariationId: ProductVariationId,
                },
              })
            )?.id;
            if (!size) {
              size = (
                await models.ProductVariationData.create({
                  DataValue: avlSize,
                  ProductVariationId: ProductVariationId,
                })
              ).id;
            }
            await models.ProductVariationDataMapping.create({
              ProductVariationDataId: size,
              ProductId: mainProduct.id,
              AdditionalPrice: 0,
            });

            const childProduct = await models.Product.create({
              name: product.name,
              skuId: avlSize,
              price: product.price,
              modelId: mainProduct.id,
              MatrixProduct: true,
            });
            await models.ProductVariationDataMapping.create({
              ProductVariationDataId: size,
              ProductId: childProduct.id,
              AdditionalPrice: 0,
            });
            childProducts.push(childProduct);
          }
        }
      }

      if (product.variants.length) {
        let ProductVariationId = (
          await models.ProductVariation.findOne({
            where: { ProductVariationName: "color" },
          })
        ).id;
        for (let i = 0; i < product.variants.length; i++) {
          const colorVariant = product.variants[i].color;
          if (colorVariant) {
            let color = (
              await models.ProductVariationData.findOne({
                where: {
                  DataValue: colorVariant,
                  ProductVariationId: ProductVariationId,
                },
              })
            )?.id;
            if (!color) {
              color = (
                await models.ProductVariationData.create({
                  DataValue: colorVariant,
                  ProductVariationId: ProductVariationId,
                })
              ).id;
            }
            await models.ProductVariationDataMapping.create({
              ProductVariationDataId: color,
              ProductId: mainProduct.id,
              AdditionalPrice:
                mainProduct.price - (product.variants[i].price || 0),
            });
            for (let j = 0; j < childProducts.length; j++) {
              let childProduct = childProducts[j];
              childProduct.set({
                skuId:
                  product.variants[i].modelId +
                  "-" +
                  childProduct.skuId +
                  "-" +
                  colorVariant.split(" ").join("_"),
                price: product.variants[i].price || childProduct.price,
              });
              childProduct = await childProduct.save();
              await models.ProductVariationDataMapping.create({
                ProductVariationDataId: color,
                ProductId: childProduct.id,
                AdditionalPrice:
                  mainProduct.price - (product.variants[i].price || 0),
              });
            }
            await models.Media.create({
              productId: color.id,
              photoLink: product.variants[i].image,
            });
          }
        }
      }
    });
    if (data) {
      return "All okay!!";
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { main };
