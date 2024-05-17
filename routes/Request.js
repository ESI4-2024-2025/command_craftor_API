// Require controller modules.
const Request = require('../controllers/requestControllers')

module.exports = function (app) {

    /**
     * @swagger
     * tags:
     *   name: Requete
     *   description: Opérations liées aux commande
     */


    /**
     * @swagger
     * components:
     *   schemas:
     *     Request:
     *       type: object
     *       properties:
     *         command:
     *           type: string
     *           example: "/give @p minecraft:diamond 1"
     *         version:
     *           type: array
     *           items:
     *             type: string
     *           example: ["1.0", "1.1"]
     *           required: true
     *         nbutilisation:
     *           type: integer
     *           example: 5
     */

    /**
     * @swagger
     * /getRequest:
     *   get:
     *     tags: [Requete]
     *     summary: Get the latest 5 requests sorted by nbutilisation in descending order.
     *     responses:
     *       '200':
     *         description: Successful response
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Request'
     *             example:
     *               - Command: "/give @p minecraft:diamond 1"
     *                 Version: ["1.0", "1.1"]
     *                 nbutilisation: 5
     */

    /**
 * @swagger
 * /ARequest:
 *   post:
 *     tags: [Requete]
 *     summary: Create or update a request.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Request'
 *           example:
 *             Command: "/exampleCommand"
 *             Version: ["1.0", "1.1"]
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *             example:
 *               Command: "/give @p minecraft:diamond 1"
 *               Version: ["1.0", "1.1"]
 *               nbutilisation: 1
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */




    //Get
    app.get('/getRequest', Request.getRequest)
    //Post
    app.post('/ARequest', Request.Request)

}