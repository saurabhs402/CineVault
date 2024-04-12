const Movie = require('../Models/movieModel')
class ApiFeatures {

    constructor(queryMong, reqQuery) {
        this.queryMong = queryMong;
        this.reqQuery = reqQuery
    }

    filter() {
        //Filtering
        //Excluding Query 
        const excludeFields = ['sort', 'page', 'limit', 'fields']

        let filterObj = { ...this.reqQuery }

        excludeFields.forEach(function (ele) {
            delete filterObj[ele];
        })
        //Ends

        //Advance Filtering--gte,gt,lt,lte
        console.log(filterObj)


        let querystr = JSON.stringify(filterObj);
        querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, function (match) {
            return `$${match}`
        })
        console.log(querystr)
        filterObj = JSON.parse(querystr)
        console.log(filterObj)


        //Ends


        //Bringing Data

        this.queryMong = this.queryMong.find(filterObj);

        //Ends

        //Ends

        return this;
    }

    sort() {

        // Sorting Logic

        if (this.reqQuery.sort) {
            let sortQuery = "" + this.reqQuery.sort;
            console.log(this.reqQuery.sort)
            sortQuery = sortQuery.replaceAll(',', ' ')
            this.queryMong = this.queryMong.sort(sortQuery);
        } else {
            //default sorting w.r.t createdAt
            this.queryMong = this.queryMong.sort('-createdAt')
        }
        //Ends
        return this;
    }

    limitFields() {

        // Limiting Fields
        if (this.reqQuery.fields) {
            let fieldsQuery = "" + this.reqQuery.fields;
            fieldsQuery = fieldsQuery.replaceAll(',', ' ');
            this.queryMong = this.queryMong.select(fieldsQuery);
        } else {
            this.queryMong = this.queryMong.select('-__v');
        }
        //Ends

        return this;
    }

    paginate() {

        // Pagination
        const pageQuery = Number(this.reqQuery.page) || 1;
        const limitQuery = Number(this.reqQuery.limit) || 10;

        //Page 1: 1-10(0 skip),Page 2:11-20 (10 skip)
        const skipCount = (pageQuery - 1) * limitQuery
        // if (this.reqQuery.page) {
        //     const moviesCount = await Movie.countDocuments();
        //     console.log(moviesCount)
        //     if (skipCount >= moviesCount)
        //         throw new Error("This page is not found")

        // }
        this.queryMong = this.queryMong.skip(skipCount).limit(limitQuery);
        //Ends

        return this;

    }



}

module.exports = ApiFeatures