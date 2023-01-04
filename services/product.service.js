const models = require("../models");

const getAllData = async (query) => {
  const limit = query.page == 0 ? null : 3;
  const page = query.page < 2 ? 0 : query.page;
  const data = await models.Product.findAll({
    include: [
      {
        model: models.Media,
        attributes: ["photo_link"],
      },
      {
        model: models.ProductVariationDataMapping,
        attributes: ["product_variation_data_id"],
        include: [
          {
            model: models.ProductVariationData,
            attributes: ["product_variation_id", "data_value"],
            include: [
              {
                model: models.ProductVariation,
                attributes: ["product_variation_name"],
              },
            ],
          },
        ],
      },
    ],
    attributes: { exclude: ["deleted_at"] },
    limit: limit,
    offset: page * 3
  });
  if (data) {
    return data;
  } else {
    throw new Error("something went wrong");
  }
};

const addData = async (payload) => {
  const val = await models.Product.findOne({
    where: { sku_id: payload.modelId },
  });
  if (val) {
    throw new Eroor("Product already exists");
  }
  let mainProduct = await models.Product.create({
    name: payload.name,
    skuId: payload.modelId,
    price: payload.price,
  });
  const childProducts = [];
  if (payload.image) {
    await model.Media.create({
      productId: mainProduct.id,
      photoLink: payload.image,
    });
  }
  if (payload.availableSize.length) {
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
  if (payload.variants.length) {
    let ProductVariationId = (
      await models.ProductVariation.findOne({
        where: { ProductVariationName: "color" },
      })
    ).id;
    for (let i = 0; i < payload.variants.length; i++) {
      const colorVariant = payload.variants[i].color;
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
          AdditionalPrice: mainProduct.price - (payload.variants[i].price || 0),
        });
        for (let j = 0; j < childProducts.length; j++) {
          let childProduct = childProducts[j];
          childProduct.set({
            skuId:
              payload.variants[i].modelId +
              "-" +
              childProduct.skuId +
              "-" +
              colorVariant.split(" ").join("_"),
            price: payload.variants[i].price || childProduct.price,
          });
          childProduct = await childProduct.save();
          await models.ProductVariationDataMapping.create({
            ProductVariationDataId: color,
            ProductId: childProduct.id,
            AdditionalPrice:
              mainProduct.price - (payload.variants[i].price || 0),
          });
        }
        await models.Media.create({
          productId: color.id,
          photoLink: payload.variants[i].image,
        });
      }
    }
  }
    return "Data updated"
};

const deactivateProduct = async (payload) => {
  const user = await models.Product.findOne({
    where: {
      id: payload.id,
    },
    include: [
      {
        model: models.Media,
        attributes: ["photo_link"],
      },
      {
        model: models.ProductVariationDataMapping,
        attributes: ["product_variation_data_id"],
        include: [
          {
            model: models.ProductVariationData,
            attributes: ["product_variation_id", "data_value"],
            include: [
              {
                model: models.ProductVariation,
                attributes: ["product_variation_name"],
              },
            ],
          },
        ],
      },
    ],
  });

  if (!user) {
    throw new Error("Product Not Found");
  }

  await models.Product.destroy({
    where: {
      id: payload.id,
    },
  });

  return "Product deactivate";
};

const enableProduct = async (payload) => {
  let { id } = payload;

  let restoreProduct = await models.Product.restore({
    where: {
      id: id,
    },
  });

  if (restoreProduct) {
    return "Product activated";
  } else {
    throw new Error("Product not found");
  }
};

module.exports = {
    getAllData,
    addData,
    deactivateProduct,
    enableProduct,

};
