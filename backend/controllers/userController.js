const dbModel = require('../models/database_model');

class UserController {
  
  async addUser(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const user = req.body;

      await dbModel.queryBuilder
        .insert('users', { name: user.name, age: user.age, sex: user.sex })
        .execute();

      const data = await dbModel.queryBuilder
        .select('*')
        .from('users')
        .execute();
      return res.status(200);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }

  async getUsers(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const data = await dbModel.queryBuilder
        .select('*')
        .from('users')
        .execute();
      console.log(data);
      return res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }

  async searchUser(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const userId = req.params.id;

      const data = await dbModel.queryBuilder
        .select('*')
        .from('users')
        .where('id', '=', userId)
        .execute();
      return res.status(202).json({ data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async deleteUser(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const userId = req.params.id;

      await dbModel.queryBuilder
        .delete()
        .from('users')
        .where('id', '=', userId)
        .execute();

      const data = await dbModel.queryBuilder
        .select('*')
        .from('users')
        .execute();
      return res.status(202);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async editUser(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const user = req.body;

      await dbModel.queryBuilder
        .update('users', {
          name: user.name,
          age: user.age,
          sex: user.sex,
        })
        .where('id', '=', user.id)
        .execute();

      const data = await dbModel.queryBuilder
        .select('*')
        .from('users')
        .execute();
      return res.status(202);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new UserController();