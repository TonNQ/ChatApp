import * as _ from 'lodash';
const REGEX = /^[a-zA-Z.]+$/;
const SPLIT_SYSBOL = ':';
export const pipeDTO = (value: any) => {
  if (value.sort && Array.isArray(value.sort)) {
    value.sort = _.reduce(
      value.sort,
      function (obj, param) {
        const [sortKey, sortValue] = param.split(SPLIT_SYSBOL);
        if (REGEX.test(sortKey) == true) {
          obj[sortKey] = sortValue ?? 'desc';
        }
        return obj;
      },
      {},
    );
  }

  if (typeof value.sort === 'string') {
    const [sortKey, sortValue] = value.sort.split(SPLIT_SYSBOL);
    if (REGEX.test(sortKey) == true) {
      value.sort = {
        [sortKey]: sortValue ?? 'desc',
      };
    } else value.sort = { createdAt: -1 };
  }

  if (JSON.stringify(value.sort) === '{}') value.sort = { createdAt: -1 };

  if (value.filter && Array.isArray(value.filter)) {
    value.filter = _.reduce(
      value.filter,
      function (obj, param) {
        const [filterKey, filterValue] = param.split(SPLIT_SYSBOL);
        obj[filterKey] = filterValue;
        return obj;
      },
      {},
    );
  }

  if (typeof value.filter === 'string') {
    const [filterKey, filterValue] = value.filter.split(SPLIT_SYSBOL);
    value.filter = {
      [filterKey]: filterValue,
    };
  }
  return value;
};
