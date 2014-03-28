#!/usr/bin/env node

var AWS = require('aws-sdk');
var env = require('superenv')('cfn');
var _ = require('underscore');
var argv = require('optimist')
    .options('region', {
        alias: 'r',
        default: 'us-east-1'
    })
    .demand(1)
    .check(function(argv) {
        argv.bucket = argv._[0];
    })
    .argv;

var s3 = new AWS.S3(_(env).extend({ region: argv.region }));
var count = 0;

function deleteObjects(err, data) {
    if (err) throw err;
    var keys = _(data.Contents).map(function(file) {
        return { Key: file.Key };
    });
    s3.deleteObjects({
        Bucket: argv.bucket,
        Delete: { Objects: keys }
    }, function (err, response) {
        if (err) throw err;
        count = count + data.Contents.length;
        console.log('Deleted %s files', count);
        if (data.IsTruncated) listObjects();
    });
}

function listObjects(marker) {
    var params = { Bucket: argv.bucket };
    if (marker) params.Marker = marker;
    s3.listObjects(params, deleteObjects);
}

listObjects();