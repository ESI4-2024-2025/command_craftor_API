const Bloc = require('../controllers/blocControllers');

module.exports = function (app) {

    /**
     * @swagger
     * tags:
     *   name: Bloc
     *   description: Opérations liées aux Blocs
     */

    /**
     * @swagger
     * components:
     *   schemas:
     *     Bloc:
     *       type: object
     *       properties:
     *         nom:
     *           type: string
     *           example: "Pierre"
     */

    /**
     * @swagger
     * /getBloc:
     *   get:
     *     tags: [Bloc]
     *     summary: Get bloc information
     *     responses:
     *       '200':
     *         description: Successful response
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Bloc'
     */
    app.get('/getBloc', Bloc.getBloc);
};
