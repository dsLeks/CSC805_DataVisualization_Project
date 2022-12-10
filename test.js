const data = [
    {
    "county":"Dewey County, OK",
    "estimated_age_adjusted_death_rate_11_categories_in_ranges":"20.1-22",
    "fips":"40043",
    "fips_state":"40",
    "population":"4995",
    "st":"OK",
    "state":"Oklahoma",
    "year":"2015",
    },
    {
    "county":"Dewey County, OK",
    "estimated_age_adjusted_death_rate_11_categories_in_ranges":"20.1-22",
    "fips":"40043",
    "fips_state":"42",
    "population":"4995",
    "st":"OK",
    "state":"Alamaba",
    "year":"2015",
    },
    {
    "county":"Dewey County, OK",
    "estimated_age_adjusted_death_rate_11_categories_in_ranges":"20.1-22",
    "fips":"40043",
    "fips_state":"40",
    "population":"4995",
    "st":"OK",
    "state":"Oklahoma",
    "year":"2015",
    }
]

/*
    Cleaning the dataset: 
    1. filter out the county, fips, st, estimated_age_adjusted_death_rate_11_categories_in_ranges
    2. Convert the population string to a number type -> is this even needed? Will javascript automatically convert for me when I try to add these two together? 
    2. Combine the populations of same states i.e. having same fip_state code 
*/

const filteredData = data.map((d) => {
    return {
        'fips_state': parseInt(d.fips_state),
        'population': parseInt(d.population),
        'state' : d.state,
        'year' : parseInt(d.year),
    }     
})


//Now combine the rows that have the same fips_state
const containsObject = (obj, list) => {
    var i; 
    for(i = 0; i < list.length; i++) {
        if(list[i].state == obj.state) {
            return i;
        }
    }

    return i; 
}


var i; 
let newFilteredData = [];
newFilteredData.push(filteredData[0]);

for(i = 1; i < filteredData.length; i++) {
    const index = containsObject(filteredData[i], newFilteredData);
    if(index < newFilteredData.length && newFilteredData.length > 0) {
        newFilteredData[index].population += filteredData[i].population;   
    } else {
        newFilteredData.push(filteredData[i]);
    }
}


let olo; 
console.log(olo);
if(olo) console.log("this olo is undefined");
else console.log("This olo is defined");