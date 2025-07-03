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
     *     Enchant:
     *       type: object
     *       properties:
     *         identifier:
     *           type: string
     *         lvlMax:
     *           type: number
     *         version:
     *           type: number
     *         minecraft_id:
     *           type: number
     *     Materiaux:
     *       type: object
     *       properties:
     *         identifier:
     *           type: string
     *         version:
     *           type: number
     *     Type:
     *       type: object
     *       properties:
     *         name:
     *           type: string
     *     Item:
     *       type: object
     *       properties:
     *         identifier:
     *           type: string
     *           example: "sword"
     *         enchantement:
     *           type: array
     *           items:
     *             $ref: '#/components/schemas/Enchant'
     *         materiaux:
     *           type: array
     *           items:
     *             $ref: '#/components/schemas/Materiaux'
     *         version:
     *           type: number
     *         type:
     *           $ref: '#/components/schemas/Type'
     */

    /**
     * @swagger
     * /getItem:
     *   get:
     *     tags: [Item]
     *     summary: Get all items (avec enchantement, materiaux et type peuplés)
     *     parameters:
     *       - in: query
     *         name: type
     *         schema:
     *           type: number
     *         description: Filtrer les items par type
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

    // app.post('/addItem', Item.addItem);

}