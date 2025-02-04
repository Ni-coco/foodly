const { Product } = require("../dtos/productDto");
const { StockDto } = require("../dtos/stockDto");
const { getProduct } = require("../utils/openFruitApiService");
const axios = require("axios");
const db = require("../models/index");
const {Stock} = db;
const {
  SuccessResponse,
  ErrorResponse,
  getColumns,
} = require("./ressources/ControllerRessources");

//Permet de récupérer un stock en fonction d'un id Produit
const getStock = async (req, res) => {
  try {
    var stock = await Stock.findOne({
      where: {
        product_id: req.params.productId,
      },
    });
    if (stock && stock.quantity > 0) {
      var fullProduct = await getProduct(stock.product_id);
      var product = new Product(fullProduct);
      SuccessResponse(res, {
        stock: stock,
        product: product,
      });
    } else {
      SuccessResponse(res, {
        message:'Aucun Produit en Stock',
        stock:null
      });
    }
  } catch (error) {
    ErrorResponse(res, error.message, 500);
  }
};

const getAllStocks = async (req, res) => {
  try {
    var stocks = await Stock.findAll({});
    if (stocks && stocks.length > 0) {
      const productPromises = stocks.map((stock) =>
        axios
          .get(
            `https://world.openfoodfacts.org/api/v2/product/${stock.product_id}`
          )
          .then((response) => ({
            stock,
            product: new Product(response.data.product),
          })) // Associer stock + produit
          .catch((error) => {
            console.error(
              `Erreur pour produit ${stock.product_id}:`,
              error.message
            );
            return { stock, product: null }; // Retourne null en cas d'erreur pour ce produit
          })
      );
      const results = await Promise.all(productPromises);
      console.log(results)

      const enrichedStocks = results.map(
        ({ stock, product }) => new StockDto(stock, product)
      );

      SuccessResponse(res, enrichedStocks);
    }
  } catch (error) {
    ErrorResponse(res, error.message, 500);
  }
};

const getPaginatedStocks = async (req, res) => {
  try {
    var stocks = await Stock.findAll({});
    var cols = getColumns(Stock.getAttributes());

    if (stocks && stocks.length > 0) {
      const productPromises = stocks.map((stock) =>
        axios
          .get(
            `https://world.openfoodfacts.org/api/v0/product/${stock.product_id}`
          )
          .then((response) => ({
            stock,
            product: new Product(response.data.product),
          })) // Associer stock + produit
          .catch((error) => {
            console.error(
              `Erreur pour produit ${stock.product_id}:`,
              error.message
            );
            return { stock, product: null }; // Retourne null en cas d'erreur pour ce produit
          })
      );
      const results = await Promise.all(productPromises);

      const enrichedStocks = results.map(
        ({ stock, product }) => new StockDto(stock, product)
      );

      SuccessResponse(res, {
        column: cols,
        datalist: enrichedStocks,
      });
    }
  } catch (error) {
    ErrorResponse(res, error.message, 500);
  }
};
const updateStock = async (req, res) => {
  try {
    var stock = await Stock.findOne({
      where: {
        product_id: req.params.productId,
      },
    });
    if(stock){
      const update = await Stock.update(
        { price: req.body.price,
          quantity : req.body.quantity },
        { where: { product_id: req.params.productId } }
      );
      var stock = await Stock.findOne({
        where: {
          product_id: req.params.productId,
        },
      });
        var fullProduct = await getProduct(stock.product_id);
        var product = new Product(fullProduct);
        SuccessResponse(res, new StockDto(stock,product));
    }
  } catch (error) {
    ErrorResponse(res, error.message, 500);
  }
};

//Permet de Réapprivisionner la quantité d'un stock
const refillStock = async (req, res) => {
  try {
    var stock = await Stock.findOne({
      where: {
        product_id: req.params.productId,
      },
    });
    if(stock){
      const update = await Stock.update(
        { quantity: Number(stock.quantity) + Number(req.body.quantity) },
        { where: { product_id: req.params.productId } }
      );
      SuccessResponse(res, { quantity: Number(stock.quantity) + Number(req.body.quantity), message: "Stock Ajouté" });
    }
    else{
      //CREATE
      const newStock = await Stock.create({
        price: req.body.price || 20.00,
        product_id: req.params.productId,
        quantity : req.body.quantity
      });
      SuccessResponse(res,{message: "Stock créé"})
    }
  } catch (error) {
    ErrorResponse(res, error.message, 500);
  }
};

const createdStock = async (req, res) => {
  try {
    var newStock = await Stock.create(req.body);
    SuccessResponse(res, newStock);
  } catch (error) {
    ErrorResponse(res, error.message, 500);
  }
};

//Permet de tester si un produit peut être vendu
const tryOutStock = async (req, res) => {
  try {
    const canSold = await Stock.findOne({
      where: {
        product_id: req.params.productId,
      },
      attributes: ["quantity"],
    });
    SuccessResponse(res, canSold.quantity > 0);
  } catch (error) {
    ErrorResponse(res, error.message);
  }
};

const deleteStock = async (req,res) =>{
  try{
    const del = await Stock.destroy({
      where: {
        product_id: req.params.productId,
      }
    });
    SuccessResponse(res,{message:'Stock bien Supprimé'})
  } catch (error) {
    ErrorResponse(res, error.message);
  }
}

module.exports = {
  getPaginatedStocks,
  createdStock,
  getStock,
  getAllStocks,
  updateStock,
  tryOutStock,
  deleteStock,
  refillStock
};
