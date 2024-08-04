---
sidebar_position: 1
title: Filter, Search, Sort, and Pagination
---
# Filter, Search, Sort, and Pagination
## Filter
To perform multiple filtering based on the `genreId` column in the `Movies` table, you can create query parameters containing multiple values separated by commas, such as `filter[genres]=1,2`.

Here is how to implement the filtering functionality in the controller, receiving `req.query` containing the filter object:

  ```jsx
  class Technique {
    static async filter(req, res, next) {
      const { filter } = req.query;
      const paramQuerySQL = {
        where: {},
      };

      // Check if the filter is provided
      if (filter && filter.genres) {
        paramQuerySQL.where.genreId = filter.genres.split(',');

      }

      try {
        const data = await Movie.findAll(paramQuerySQL);
        res.status(200).json(data);
      } catch (err) {
        next(err);
      }
    }
  }
  ```

To filter the movies, you can access the endpoint like this:

> `/movies?filter[genres]=1,2`

This will display all movies with `genreId` 1 and 2 only.
## Search
To implement searching based on the movie title, you can use a query parameter `q` that allows users to search for movies by title.

Here is how to implement the searching functionality in the controller, receiving `req.query` containing the search parameter:

```jsx
class Technique {
  static async search(req, res, next) {
    const { q } = req.query;
    const paramQuerySQL = {
      where: {},
    };
    
    if (q) {
      paramQuerySQL.where.title = {
        [Op.like]: `%${q}%`,
      };
    }

    try {
      const data = await Movie.findAll(paramQuerySQL);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}
```

To search for movies, you can access the endpoint like this:

> `/movies?q=your`

This will display all movies with titles that include the term "your"
## Sort
To perform sorting based on a selected column in the `Movies` table, you can create query parameters by writing the column name as the query value for ascending sorting or by prefixing it with a minus (-) for descending sorting, such as `sort=name` or `sort=-name`.

Here is how to implement the sorting functionality in the controller, receiving `req.query` containing the sort parameter:

```jsx
class Technique {
  static async sort(req, res, next) {
    const { sort } = req.query;
    const paramQuerySQL = {};

    // Sorting
    if (sort) {
      paramQuerySQL.order = [[sort.by, sort.order]];
    }

    try {
      const data = await Movie.findAll(paramQuerySQL);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}
```

To sort the movies, you can access the endpoint like this:

> `/movies?sort[by]=rating&sort[order]=asc`

This will display all movies sorted by rating in descending order.

> `/movies?sort[by]=rating&sort[order]=desc`

This will display all movies sorted by rating in ascending order.

## Pagination
To perform pagination, which means determining the number of data per page and accessing a specific page of data, you can create query parameters with `page` containing `size` and `number`, such as `page[size]=5` and `page[number]=1`.

Here is how to implement the pagination functionality in the controller, receiving `req.query` containing the page parameters:

```jsx
class Technique {
  static async pagination(req, res, next) {
    const { page } = req.query;
    const paramQuerySQL = {
      limit: 5, // Default limit
      offset: 0, // Default offset
    };

    // Pagination
    if (page) {
      if (page.size) {
        paramQuerySQL.limit = page.size;
      }

      if (page.number) {
        paramQuerySQL.offset = page.number * paramQuerySQL.limit - paramQuerySQL.limit;
      }
    }

    try {
      const data = await Movie.findAll(paramQuerySQL);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}
```

To paginate the movies, you can access the endpoint like this:

> `/movies?page[size]=5&page[number]=2`

This will display 5 movies on the second page.
## Combining Pagination, Filter, Search, Sort

When filtering, sorting, searching, and pagination are used together, it can be implemented as follows:

```jsx
const { Movie, Sequelize } = require('../models');
const { Op } = Sequelize;

class Technique {
  static async getMovies(req, res, next) {
    const { filter, q, page, sort } = req.query;
    const paramQuerySQL = {
      limit: 5, // Default limit
      offset: 0, // Default offset
      where: {},
    };

    // Searching
    if (q) {
      paramQuerySQL.where.title = {
        [Op.iLike]: `%${q}%`,
      };
    }

    // Filtering
    if (filter && filter.genres) {
      paramQuerySQL.where.genreId = filter.genres.split(',');
    }

    // Pagination
    if (page) {
      if (page.size) {
        paramQuerySQL.limit = page.size;
      }

      if (page.number) {
        paramQuerySQL.offset = page.number * paramQuerySQL.limit - paramQuerySQL.limit;
      }
    }

    // Sorting
    if (sort) {
      paramQuerySQL.order = [[sort.by, sort.order]];
    }

    try {
      const data = await Movie.findAndCountAll(paramQuerySQL);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}

```

Here is the full controller function combining these functionalities:

To access the combined functionality, use the following endpoint:

> `/movies?filter[genres]=1&q=Inception&page[number]=1&page[size]=10&sort[by]=ratingsort[order]=desc`

This will display all movies with `genreId` 1, with titles that include "Inception," sorted by rating in descending order, with a total of 10 movies on the first page.