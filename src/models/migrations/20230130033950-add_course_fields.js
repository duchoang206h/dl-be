'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('courses', 'start_date', {
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn('courses', 'end_date', {
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn('courses', 'color', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('courses', 'address', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('courses', 'logo', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('courses', 'banner', {
      type: Sequelize.STRING,
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
