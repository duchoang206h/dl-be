'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('players', 'status_day', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('players', 'note', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('players', 'birth', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('players', 'height', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('players', 'turnpro', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('players', 'weight', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('players', 'driverev', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('players', 'putting', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('players', 'best', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('players', 'is_show', {
      type: Sequelize.BOOLEAN,
    });
    /**
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
