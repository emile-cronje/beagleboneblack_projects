"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbMapper = void 0;
var DbMapper = /** @class */ (function () {
    function DbMapper(columnToPropertyMap) {
        this.columnToPropertyMap = columnToPropertyMap;
    }
    DbMapper.prototype.map = function (dbObject) {
        var result = {};
        for (var column in this.columnToPropertyMap) {
            var property = this.columnToPropertyMap[column];
            result[property] = dbObject[column];
        }
        return result;
    };
    DbMapper.prototype.mapList = function (dbObjects) {
        var _this = this;
        return dbObjects.map(function (dbObject) { return _this.map(dbObject); });
    };
    return DbMapper;
}());
exports.DbMapper = DbMapper;
