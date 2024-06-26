// Require controller modules.
const Item = require('../controllers/itemControllers')

module.exports = function (app) {

    /**
     * @swagger
     * tags:
     *   name: Item
     *   description: Opérations liées aux Items
     */

    /**
     * @swagger
     * components:
     *   schemas:
     *     Item:
     *       type: object
     *       properties:
     *         Nom:
     *           type: string
     *           example: "Sword"
     *         identifier:
     *           type: string
     *           example: "sword"
     *         enchantement:
     *           type: array
     *           items:
     *             type: number
     *           example: [1, 2, 3]
     *         materiaux:
     *           type: array
     *           items:
     *             type: number
     *           example: [1, 2]
     */

    /**
     * @swagger
     * /getItem:
     *   get:
     *     tags: [Item]
     *     summary: Get all items
     *     responses:
     *       '200':
     *         description: Successful response
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Item'
     */

    //Get
    app.get('/getItem', Item.getItem)

    // app.post('/addItem', Item.addVersion);

}