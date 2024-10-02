const mysql = require('mysql');

class QueryBuilder {
  constructor(databaseInstance) {
    this.database = databaseInstance;
    this._select = '*';
    this._from = '';
    this._where = [];
    this._orderBy = '';
    this._limit = '';
    this._insert = null;
    this._update = null;
    this._delete = false;
  }

  select(columns) {
    if (Array.isArray(columns)) {
      this._select = columns.join(', ');
    } else {
      this._select = columns;
    }
    return this;
  }

  from(table) {
    this._from = table;
    return this;
  }

  where(column, operator, value) {
    this._where.push({ column, operator, value });
    return this;
  }

  orderBy(column, direction = 'ASC') {
    this._orderBy = `${column} ${direction}`;
    return this;
  }

  limit(number) {
    this._limit = number;
    return this;
  }

  insert(table, data) {
    this._insert = { table, data };
    return this;
  }

  update(table, data) {
    this._update = { table, data };
    return this;
  }

  delete() {
    this._delete = true;
    return this;
  }

  build() {
    if (this._insert) {
      const columns = Object.keys(this._insert.data).join(', ');
      const values = Object.values(this._insert.data).map((val) => `'${val}'`).join(', ');
      return `INSERT INTO ${this._insert.table} (${columns}) VALUES (${values});`;
    }

    if (this._update) {
      const setClauses = Object.entries(this._update.data)
        .map(([key, value]) => `${key} = '${value}'`)
        .join(', ');

      let query = `UPDATE ${this._update.table} SET ${setClauses}`;

      if (this._where.length > 0) {
        const whereClauses = this._where
          .map((cond) => `${cond.column} ${cond.operator} '${cond.value}'`)
          .join(' AND ');
        query += ` WHERE ${whereClauses}`;
      }

      return query + ';';
    }

    if (this._delete) {
      let query = `DELETE FROM ${this._from}`;

      if (this._where.length > 0) {
        const whereClauses = this._where
          .map((cond) => `${cond.column} ${cond.operator} '${cond.value}'`)
          .join(' AND ');
        query += ` WHERE ${whereClauses}`;
      }

      return query + ';';
    }

    if (!this._from) {
      throw new Error('FROM clause is missing');
    }

    let query = `SELECT ${this._select} FROM ${this._from}`;

    if (this._where.length > 0) {
      const whereClauses = this._where
        .map((cond) => `${cond.column} ${cond.operator} '${cond.value}'`)
        .join(' AND ');
      query += ` WHERE ${whereClauses}`;
    }

    if (this._orderBy) {
      query += ` ORDER BY ${this._orderBy}`;
    }

    if (this._limit) {
      query += ` LIMIT ${this._limit}`;
    }

    return query + ';';
  }

  async execute() {
    const sql = this.build();
    const result = await this.database.query(sql);
    
    this.reset();
    
    return result;
  }

  reset() {
    this._select = '*';
    this._from = '';
    this._where = [];
    this._orderBy = '';
    this._limit = '';
    this._insert = null;
    this._update = null;
    this._delete = false;
    return this;
  }
}

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'myDatabase',
    });
    this.queryBuilder = new QueryBuilder(this);
  }

  getConnection() {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          resolve(connection);
        }
      });
    });
  }

  releaseConnection(connection) {
    connection.release();
  }

  query(sql, values) {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  buildAndQuery() {
    const sql = this.queryBuilder.build();
    return this.query(sql); 
  }

  resetQueryBuilder() {
    this.queryBuilder.reset();
  }
}

module.exports = new Database(); 