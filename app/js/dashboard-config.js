function isMimeTypeExcluded (mime_type) {
    var excludes = ['total', 'unknown', 'zip', 'complex'];
    return excludes.includes(mime_type.toLowerCase());
}

function getGraphsFromConfig()
{
    return {
        // Note: chartId value doesn't matter at all but has to be unique
        // apiUrls correspond with the dropdown menu options
        // charType: line, bar, doughnut, pie, radar, polar, horizontalBar
        evolutionRegistration: { 
            chartId: 'evoReg',
            chartTitle: 'Geregistreerde dragers',
            chartDescription: 'Deze grafiek toont het aantal geregistreerde dragers in functie van de tijd:',
            chartType: 'line',
            chartFormat: 2,
            apiUrls: [
                '/api/report/ams?gran=last-week',
                '/api/report/ams?gran=last-month',
                '/api/report/ams?gran=last-year',
                '/api/report/ams?gran=all-time'
            ],
            data: {},
            errormessages: [],
            activeView: 'cumulative',
            isLoading: false 
        },
        // evolutionDigitising: { 
        //     chartId: 'evoDig',
        //     chartTitle: 'Digitalisatie',
        //     chartType: 'line',
        //     chartFormat: 0,
        //     apiUrls: [
        //         '/api/report/ams?gran=last-day',
        //         '/api/report/ams?gran=last-week',
        //         '/api/report/ams?gran=last-month',
        //         '/api/report/ams?gran=last-year'
        //     ],
        //     data: {},
        //     errormessages: [],
        //     activeView: 'effective',
        //     isLoading: false 
        // },
        archiveGrowthItems: {
            chartId: 'archiGrowthItems',
            chartTitle: 'Gearchiveerde items',
            chartDescription: 'Deze grafiek toont het aantal gearchiveerde items in functie van de tijd:',
            what: 'items',
            chartType: 'line',
            chartFormat: 2,
            apiUrls: [
                '/api/report/mam/items?gran=last-week',
                '/api/report/mam/items?gran=last-month',
                '/api/report/mam/items?gran=last-year',
                '/api/report/mam/items?gran=all-time'
            ],
            data: {},
            errormessages: [],
            activeView: 'cumulative',
            isLoading: false 
        },
        archiveGrowthBytes: {
            chartId: 'archiGrowthBytes',
            chartTitle: 'Aantal gearchiveerde terabytes',
            chartDescription: 'Deze grafiek toont het aantal terabytes die gearchiveerd zijn in functie van de tijd:',
            what: 'bytes',
            chartType: 'line',
            chartFormat: 2,
            apiUrls: [
                '/api/report/mam/bytes?gran=last-week',
                '/api/report/mam/bytes?gran=last-month',
                '/api/report/mam/bytes?gran=last-year',
                '/api/report/mam/bytes?gran=all-time'
            ],
            data: {},
            errormessages: [],
            activeView: 'cumulative',
            isLoading: false 
        }
    };
}

// formatType should match the option of the graph dropdown menu
// Choose a date format per graph view 
function getFormatString(formatType) {
    if(formatType == '0') formatString = 'DD/MM HH:mm';
    else if(formatType == 1) formatString = 'DD/MM/YYYY';
    else if(formatType == 2) formatString = 'DD/MM/YYYY';
    else if(formatType == 3) formatString = 'DD/MM/YYYY';
    return formatString;
}