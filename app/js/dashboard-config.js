
function getGraphsFromConfig()
{
    return {
        // These objects have to match the 'view' v-model options (from dropdown)
        // Note: chartId value doesn't matter at all but has to be unique
        personal: {
            evolutionRegistration: { 
                dropdown: 1,
                chartId: 'data_1_chart',
                chartTitle: 'Evolutie Registratie',
                chartType: 'line',
                chartFormat: 0,
                apiUrls: [
                    'http://localhost:1337/api/reports/items/last-week',
                    'http://localhost:1337/api/reports/items/last-month',
                    'http://localhost:1337/api/reports/items/last-year'
                ],
                data: {},
                activeView: 'effective',
                isLoading: false 
            },
            archiveGrowth: {
                dropdown: 1,
                chartId: 'data_2_chart',
                chartTitle: 'Aangroei Archief',
                chartType: 'line',
                chartFormat: 0,
                apiUrls: [
                    'http://localhost:1337/api/reports/items/last-week',
                    'http://localhost:1337/api/reports/items/last-month',
                    'http://localhost:1337/api/reports/items/last-year'
                ],
                data: {},
                activeView: 'effective',
                isLoading: false 
            },
        },
        viaa: {
            evolutionRegistration: {
                dropdown: 1,
                chartId: 'data_1_chart',
                chartTitle: 'TEST TITLE',
                chartType: 'bar',
                chartFormat: 0,
                apiUrls: [
                    'http://localhost:1337/api/reports/items/last-week',
                    'http://localhost:1337/api/reports/items/last-month',
                    'http://localhost:1337/api/reports/items/last-year'
                ],
                data: {},
                activeView: 'effective',
                isLoading: false 
            },
            archiveGrowth: {
                dropdown: 1,
                chartId: 'data_2_chart',
                chartTitle: 'TDATA 2 TEST TITLE',
                chartType: 'line',
                chartFormat: 0,
                apiUrls: [
                    'http://localhost:1337/api/reports/items/last-week',
                    'http://localhost:1337/api/reports/items/last-month',
                    'http://localhost:1337/api/reports/items/last-year'
                ],
                data: {},
                activeView: 'effective',
                isLoading: false 
            }
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
    console.log(formatString);
    return formatString;
}