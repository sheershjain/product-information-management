const { commonErrorHandler } = require("../helper/error-handler.helper");
const { mapperService } = require("../services/mapper.service");
const models = require("../models");
const { sequelize } = require("../models");
// 
const main = async () => {
  const product = {
    availableSizes: [
      "11",
      "12",
      "hidden",
      "7",
      "8",
      "9",
      "7.5",
      "8.5",
      "10",
      "9.5",
    ],
    category: "shoes",
    colorVariations: ["H01878", "H01877"],
    name: "Samba Vegan Shoes",
    image:
      "https://assets.adidas.com/images/w_280,h_280,f_auto,q_auto:sensitive/508d2737737f40bbbd66ac5a0160e0e8_9366/samba-vegan-shoes.jpg",
    modelId: "LSS88",
    price: 8999,
    productId: "H01877",
    variants: [
      {
        productId: "H01877",
        color: "Cloud White / Core Black / Gum",
        image:
          "https://assets.adidas.com/images/w_280,h_280,f_auto,q_auto:sensitive/508d2737737f40bbbd66ac5a0160e0e8_9366/samba-vegan-shoes.jpg",
        modelId: "LSS88",
        price: 8999,
      },
      {
        productId: "H01878",
        color: "Cloud White / Core Black / Gum",
        image:
          "https://assets.adidas.com/images/w_280,h_280,f_auto,q_auto:sensitive/3a889f64f48a474cb87aac5a015f205c_9366/samba-vegan-shoes.jpg",
        modelId: "LSS88",
        price: 8999,
      },
    ],
  };

  const val = await models.Product.findOne({
    where: { sku_id: product.modelId },
  });
  if (val) {
    console.log("already exists");
  }

  const data1 = await models.Product.create({
    name: product.name,
    sku_id: product.modelId,
    price: product.price,
  });

  if (product.availableSizes.length) {
    const ProductVariationId = (
      await models.ProductVariation.findOne({ where: { name: "size" } })
    ).id;
    for (let i = 0; i < product.availableSizes.length; i++) {
      let size = await models.ProductVariationData.findOne({
        where: {
          data_value: product.availableSizes[i],
          product_variation_id: ProductVariationId,
        },
      });
      if (!size) {
        size = await models.ProductVariationData.create({
          data_value: product.availableSizes[i],
          product_variation_id: ProductVariationId,
        });
      }
      await models.ProductVariationDataMapping.create({
        product_variation_data_id: size.id,
        product_id: data1.id,
        additional_price:0
      });
    }
  }
};

// getAllDataProduct getPdotByid item_fieldAdd(CURD) product_variation(C) product(CURD) prod_var_data()
