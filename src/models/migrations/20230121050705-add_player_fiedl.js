'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('players', 'age', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn('players', 'code', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('players', 'sex', {
      type: Sequelize.BOOLEAN,
    });
    await queryInterface.addColumn('players', 'group', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('players', 'club', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('players', 'avatar', {
      type: Sequelize.STRING,
    });
    /**-
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
