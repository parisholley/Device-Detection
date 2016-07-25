var http = require("http");
var FiftyOneDegrees = require("../FiftyOneDegreesV3");

var config ={
	"properties" : 'BrowserName,BrowserVendor,BrowserVersion,DeviceType,'+
	'HardwareVendor,IsTablet,IsMobile,IsCrawler,ScreenInchesDiagonal,'+
	'ScreenPixelsWidth',
    "dataFile" : "../data/51Degrees-LiteV3.2.dat",
	"UsageSharingEnabled" : false,
    "stronglyTyped" : false
}

// Set the properties in an array.
var properties = config.properties.split(/,/);

// Initialise a new Provider.
var provider = new FiftyOneDegrees.provider(config);

// Set html links globally.
dataOptions = ('<a class="button" target="_blank" href="https://51degrees.com/'+
'compare-data-options?utm_source=github&utm_medium=repository&utm_content='+
'server_pattern_compare&utm_campaign=node-open-source" title="Compare '+
'Premium and Enterprise Data Options">Compare Data Options</a>')
methodHyperLinkUA = ('<a class="button" target="_blank" href="https://'+
'51degrees.com/support/documentation/pattern?utm_source=github&utm_medium='+
'repository&utm_content=example_pattern_ua&utm_campaign=node-open-source" '+
'title="How Pattern Device Detection Works">About Metrics</a>')
methodHyperLinkHeaders = ('<a class="button" target="_blank" href="https://'+
'51degrees.com/support/documentation/pattern?utm_source=github&utm_medium='+
'repository&utm_content=example_pattern_headers&utm_campaign=node-open-'+
'source" title="How Pattern Device Detection Works">About Metrics</a>')
propertiesHyperLinkUA = ('<a class="button" target="_blank" href="https://'+
'51degrees.com/resources/property-dictionary?utm_source=github&utm_medium='+
'repository&utm_content=server_pattern_properties_ua&utm_campaign=python-'+
'open-source" title="Review All Properties">All Properties</a>')
propertiesHyperLinkHeaders = ('<a class="button" target="_blank" href="https:'+
'//51degrees.com/resources/property-dictionary?utm_source=github&utm_medium='+
'repository&utm_content=server_pattern_properties_headers&utm_campaign=node'+
'-open-source" title="Review All Properties">All Properties</a>')
propertyNotFound = ('<a target="_blank" href="https://51degrees.com/compare-'+
'data-options?utm_source=github&utm_medium=repository&utm_content=server_'+
'pattern_compare&utm_campaign=node-open-source">Switch Data Set</a>')

var outputProperties = function (res, match, propertiesHyperLink, methodHyperLink) {
    res.write('<table>');
    res.write('<tr><th colspan="2">Match Metrics</th><td rowspan="5">' +
             methodHyperLink + '</td></tr>');
    res.write('<tr><td>Id</td><td>' + match.Id + '</td></tr>');
    res.write('<tr><td>Method</td><td>' + match.Method + '</td></tr>');
    res.write('<tr><td>Difference</td><td>' + match.Difference + '</td></tr>');
    res.write('<tr><td>Rank</td><td>' + match.Rank + '</td></tr>');

    res.write('<tr><th colspan="2">Device Properties</th>' +
              '<td rowspan="' + (properties.length + 1) +
              '">' + propertiesHyperLink + '</td></tr>');
    properties.forEach(function(property) {
        var values = match[property];
        if (values !== undefined) {
        res.write('<tr><td><a target="_blank" href="https://51degrees.com'+
                  '/resources/property-dictionary#' + property +
                  '" title="Read About ' + property + '">' +
                  property + '</a></td><td>')
        res.write(values);
        res.write('</td></tr>');
        } else {
            res.write('<tr><td><a target="_blank" href="https://51degrees.com'+
                  '/resources/property-dictionary#' + property +
                  '" title="Read About ' + property + '">' +
                  property + '</a></td><td>' + propertyNotFound +
                  '</td></tr>');
        }
        })        
        res.write('</table>');    
}

console.log("Starting server on localhost at port 8080.");

http.createServer(function (req, res) {
    // Begin html formatting.
        res.write('<!doctype html>')
        res.write('<html>')
        res.write('<link rel="stylesheet" type="text/css" href="'+
		'https://51degrees.com/Demos/examples.css" class="inline">')
        res.write('<body>')
        res.write('<div class="content">')

        res.write('<p><img src="https://51degrees.com/DesktopModules/'+
		'FiftyOne/Distributor/Logo.ashx?utm_source=github&utm_medium='+
		'repository&utm_content=server_pattern&utm_campaign=node-'+
		'open-source"></p>')
        res.write('<h1>Node.js Pattern - Device Detection '+
		'Server Example</h1>')
        
        // Output data set information.
        res.write('<table>')
        res.write('<tr><th colspan="3">Data Set Information</th></tr>')
        res.write('<tr><td>Name</td><td>' + provider.getDataSetName() +
        '</td><td rowspan="6">' + dataOptions + '</td></tr>')
        res.write('<tr><td>Format</td><td>' +
		provider.getDataSetFormat() +'</td></tr>')
        res.write('<tr><td>Published Date</td><td>'+
		provider.getDataSetPublishedDate() + '</td></tr>')
        res.write('<tr><td>Next Update Date</td><td>'+
		provider.getDataSetNextUpdateDate() + '</td></tr>')
        res.write('<tr><td>Signature Count</td><td>' +
		provider.getDataSetSignatureCount() + '</td></tr>')
        res.write('<tr><td>Device Combinations</td><td>' +
		provider.getDataSetDeviceCombinations() + '</td></tr>')

        res.write('</table>')

    try {
        // Perform a match for a single User-Agent.
        var match = provider.match(req.headers["user-agent"]);

        // Output properties from the match.
        outputProperties(res, match, propertiesHyperLinkUA, methodHyperLinkUA);
    } finally {
        // Dispose of the Match object.
        match.close();
    }
    try {
        // Perform a match for all http headers.
        var match = provider.match(req.headers);
        
        // Print http relevant http headers.
        res.write('<table>');
        res.write('<tr><th colspan="2">Match with HTTP Headers</th></tr>');
        res.write('<tr><th colspan="2">Relevant HTTP Headers</th></tr>');

        var importantHeaders = provider.getHttpHeadersLower();
        Object.keys(importantHeaders).forEach(function (header) {
            res.write('<tr><td>' + importantHeaders[header] + '</td><td>');
            if (req.headers[header] !== undefined) {
                res.write(req.headers[header] + '</td></tr>');
            } else {
                res.write('<i>header not set</i>');
            }
        })
        res.write('</table>');

        
        // Output properties from the match.
        outputProperties(res, match, propertiesHyperLinkHeaders, methodHyperLinkHeaders);
    } finally {
        // Dispose of the Match object.
        match.close();
    }
    
    res.write('</div></body></html>');
    res.end();
}).listen(8080);
