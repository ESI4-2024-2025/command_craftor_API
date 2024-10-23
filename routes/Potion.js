const Potion = require('../controllers/potionControllers');

module.exports = function (app) {

    /**
     * @swagger
     * tags:
     *   name: Potion
     *   description: Operations related to Potions
     */

    /**
     * @swagger
     * components:
     *   schemas:
     *     Potion:
     *       type: object
     *       properties:
     *         name:
     *           type: string
     *           example: "Healing Potion"
     */

    /**
     * @swagger
     * /getPotion:
     *   get:
     *     tags: [Potion]
     *     summary: Get potion information
     *     responses:
     *       '200':
     *         description: Successful response
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Potion'
     */
    app.get('/getPotion', Potion.getPotion);
};
