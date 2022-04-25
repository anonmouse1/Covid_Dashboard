
const countyURL = "https://services1.arcgis.com/eNO7HHeQ3rUcBllm/arcgis/rest/services/Covid19CountyStatisticsHPSCIrelandOpenData/FeatureServer/0/query?where=1%3D1&outFields=CountyName,PopulationCensus16,ConfirmedCovidCases,PopulationProportionCovidCases&outSR=4326&f=json";
const xmlhttp = new XMLHttpRequest();
let cleanedCounties;
let county1;
let county2;
let county3;
let selectedCounty;
let numberedCounties =[];
let max_week;

xmlhttp.onreadystatechange = function() {
if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
//Call the county statistics API and parse the JSON  data to a JavaScript variable. 
    parsedCounties= JSON.parse(xmlhttp.responseText);
    let countyArray = parsedCounties.features;
    let count_Counties = countyArray.length;
    // removing the duplicate county objects from the api response
    cleanedCounties = uniqBy(countyArray, JSON.stringify);
    //console.log(cleanedCounties);
    //generating a dynamic dropdown list with county names
    // when a county is selected - running findCountyNumber to find county index value and passing this value into displayCountyData which will generate a table with information for selected county
    let dropdown1 = "<select id = 'chosenCounty' onchange = 'findCountyNumber(numberedCounties,this.value,1);displayCountyData(cleanedCounties,county1,1)' class = 'dropdown_btn' >"
    // onclick runs the function that looks up this.value (ie the county name) and maps it to a number, it should then call displayCountyData with the number as the input
    for ( let obj in cleanedCounties) {
        dropdown1 += "<option value="+"'" + cleanedCounties[obj].attributes.CountyName + "'"+ ">" + cleanedCounties[obj].attributes.CountyName;
    }
    dropdown1 += "</select>"
    document.getElementById("county1Dropdown").innerHTML = "Please select a county: " + dropdown1;
    //creating dropdown2 for second county table generation
    let dropdown2 = "<select id = 'chosenCounty' onchange = 'findCountyNumber(numberedCounties,this.value,2);displayCountyData(cleanedCounties,county2,2)' class = 'dropdown_btn' >"
    for ( let obj in cleanedCounties) {
        dropdown2 += "<option value="+"'" + cleanedCounties[obj].attributes.CountyName + "'"+ ">" + cleanedCounties[obj].attributes.CountyName;
    }
    dropdown2 += "</select>"
    document.getElementById("county2Dropdown").innerHTML = "Please select a county: " + dropdown2;
    //creating dropdown3 for third county table generation
    let dropdown3 = "<select id = 'chosenCounty' onchange = 'findCountyNumber(numberedCounties,this.value,3);displayCountyData(cleanedCounties,county3,3)' class = 'dropdown_btn' >"
    for ( let obj in cleanedCounties) {
        dropdown3 += "<option value="+"'" + cleanedCounties[obj].attributes.CountyName + "'"+ ">" + cleanedCounties[obj].attributes.CountyName;
    }
    dropdown3 += "</select>"
    document.getElementById("county3Dropdown").innerHTML = "Please select a county: " + dropdown3;

    getCountyArrayNumber();
    // calling findMax and findMin to display the counties with the higest and lowest covid rates
    findMax();
    findMin();

}

}

xmlhttp.open("GET" , countyURL, true);
xmlhttp.send();

//this creates a new array with only the county name and a number as a key value pair
function getCountyArrayNumber() {
    //let numberedCounties =[];
    let i = 0;
    for ( let obj in cleanedCounties) {
        numberedCounties.push({county: cleanedCounties[obj].attributes.CountyName,number: i})//(This creates the array of objects county:number)
        i++;
    }
    //console.log(numberedCounties)

}
//this gets the index number of a county based on input of county name (from dropdown)
function findCountyNumber(array,countyName,int){
    countyToFind = countyName;
    originalArray = array;
    for(var i = 0; i < array.length; i++) {
    if(array[i].county == countyToFind) {
        //slice the county name and related number to allow selecting data in cleanedCounties array using county number as index
        selectedCounty = array.slice(i, i +1);

        //if statement to determine which inner.html element should be changed(county1,county2 or county3)
        console.log("Check here for single county array",selectedCounty);
        if (int == 1){
            county1 = selectedCounty[0].number
        } else if (int == 2) {
            county2 = selectedCounty[0].number
        } else if (int == 3) {
            county3 = selectedCounty[0].number
        }
        //console.log(county1);
        //console.log(county2);
        //console.log(county3);
        break;
    }
  
}
    
}
// function that generates a table with covid data for a selected county
function displayCountyData(array,countyNumber,tableNumber){
    let htmlid =  "county" + tableNumber ;
    //console.log("htmlid",htmlid);

    let CountyName = array[countyNumber].attributes.CountyName;
    //console.log(CountyName);
    let Population = array[countyNumber].attributes.PopulationCensus16;
    let confirmedCases = array[countyNumber].attributes.ConfirmedCovidCases;
    let casesper100th = Math.round(array[countyNumber].attributes.PopulationProportionCovidCases);
    let proportionCases = (casesper100th/1000).toFixed(2);

    //document.getElementById(htmlid).innerHTML = "County: " + CountyName + "\n" + "Population: " + Population + "\n" + "Covid cases: " + confirmedCases + "\n" + "ProportionalCases: " + proportionalCases;
    let text = "<table border='1'>";
    text += "<tr><td>" + "County: " + CountyName + "</td></tr>";
    text += "<tr><td>" + "Population: " + Population + "</td></tr>";
    text += "<tr><td>" + "Confirmed Covid cases: " + confirmedCases + "</td></tr>";
    text += "<tr><td>" + "Population Proportional Cases: " + proportionCases + "%" + "</td></tr>";
    text += "<tr><td>" + "Cases per 100,000: " + casesper100th + "</td></tr>";
   

    text += "</table>"
    //document.getElementById("county1").innerHTML = text;
    document.getElementById(htmlid).innerHTML = text;

}
//function uniqBy from online source:https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array User Casey Kuball
//removes duplicate entries of county values due to API returning several duplicate entries for each county
function uniqBy(a, key) {
    var seen = {};
    return a.filter(function(item) {
        var k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
}
// finds the county with the highest number of Covid cases bases on value from API "PopulationProportionCovidCases"
//displays the county name and number of cases per 100,000
function findMax(){
    max = {county: cleanedCounties[0].attributes.CountyName, proportionCases: cleanedCounties[0].attributes.PopulationProportionCovidCases};

    for ( let cnty in cleanedCounties) {
        if (cleanedCounties[cnty].attributes.PopulationProportionCovidCases > max.proportionCases) {
           
            max = {county: cleanedCounties[cnty].attributes.CountyName, proportionCases: cleanedCounties[cnty].attributes.PopulationProportionCovidCases};
        }

    }
    //console.log("Max",max)
    document.getElementById("countyHighest").innerHTML = "Highest Covid case rate:  " + max.county +" "+ "(" + Math.round(max.proportionCases) + " cases per 100,000"+ ")"
}
// finds the county with the lowest number of Covid cases bases on value from API "PopulationProportionCovidCases"
//displays the county name and number of cases per 100,000
function findMin() {
    min = {county: cleanedCounties[0].attributes.CountyName, proportionCases: cleanedCounties[0].attributes.PopulationProportionCovidCases};

for ( let cnty in cleanedCounties) {
    if (cleanedCounties[cnty].attributes.PopulationProportionCovidCases < min.proportionCases) {
        min = {county: cleanedCounties[cnty].attributes.CountyName, proportionCases: cleanedCounties[cnty].attributes.PopulationProportionCovidCases}
    }

}
//console.log("Min",min)
document.getElementById("countyLowest").innerHTML = "Lowest Covid case rate:  " + min.county +" "+ "(" + Math.round(min.proportionCases) + " cases per 100,000"+ ")"

}

 // BEGIN reading in the weekly vaccination data using JSON.parse and assign to an array parsedWeekly
 let parsedWeekly;
            let xmlhttp1 = new XMLHttpRequest();
            const url = "https://services-eu1.arcgis.com/z6bHNio59iTqqSUY/arcgis/rest/services/COVID19_Weekly_Vaccination_Figures/FeatureServer/0/query?where=1%3D1&outFields=Week,Pfizer,Janssen,AstraZeneca,ExtractDate,Moderna,TotalweeklyVaccines&outSR=4326&f=json";
            let total_figure = 0;
            //initialising variable with global scope that can be used as parameter for changing age data to percentage
            let always_correct_week;

            function defineUserWeek() {
                
                user_week = document.getElementById('user_select_week').value;
                if (user_week > max_week) {
                    document.getElementById("max_week_error").innerHTML = "Error: Week entered must not be greater than the most recent week available " + "(" + max_week + ")"
                }
                //reset the checkbox on reload of new week
                document.getElementById("check").checked = false;
                //console.log("Logging user input week: ",user_week)
                userWeekparsedArray(parsedWeekly,user_week)
                userWeekparsedByAgeArray(parsedbyAgeWeekly,user_week)
  }
            // function to trigger a change to vaccination per age data to a percentage based on the state of a checkbox
            function changeToPercentage(week_selected){
                ;
                let user_week = week_selected;
                var isitChecked = document.getElementById("check").checked;
                //console.log("this is the isitchecked variable",isitChecked)
                if (isitChecked == true){
                    userWeekparsedByAgeArrayPercentage(parsedbyAgeWeekly,user_week)
                    //console.log("running percentage parsed by age array")
                } else {
                    userWeekparsedByAgeArray(parsedbyAgeWeekly,user_week)
                    //console.log("Running normal parsed by age array")
                }

            }

            xmlhttp1.onreadystatechange = function() {
            if (xmlhttp1.readyState == 4 && xmlhttp1.status == 200) {

                //Parse the JSON data to a JavaScript variable. 
                parsedWeekly= JSON.parse(xmlhttp1.responseText);
                //console.log(parsedWeekly)
                //console.log(parsedWeekly.features)
                let weeklyArray = parsedWeekly.features;
                weeklyArray = weeklyArray.slice(1,weeklyArray.length);
                let week_number = weeklyArray.length;
                //parsedArray(parsedWeekly)
                userWeekparsedArray(parsedWeekly,week_number)
            }
         };

            xmlhttp1.open("GET", url, true);
            xmlhttp1.send();
            //END read in weekly vaccination data
            
            //function that returns data up to the week specified by the user to allow for customisation of figures to suit user input
            function userWeekparsedArray(parsedWeekly,user_week_in) {
             
             let weeklyArray = parsedWeekly.features;
             max_week = weeklyArray.length -1;
             //console.log("this is the max week",max_week);
             let week_number = Number(user_week_in);
             let end_of_array = Number(week_number + 1)
             let week_index = week_number -1;
             always_correct_week = week_number;
             
             //console.log("Week Index",week_index);
             //slice the array to exclude first element which is a 2020 figure(2021 only in this project)
             weeklyArray = weeklyArray.slice(1,end_of_array);
             //console.log(weeklyArray);
             
             //creating variable for total 2021 total vaccinations
             total_figure = 0;
             //creating a variable that represennts the total weeklyVaccines figure in the last object in the weeklyArray(ie. this is the most recent week)
             let this_week_number = week_number
             let this_week_vaccines = weeklyArray[week_index].attributes.TotalweeklyVaccines;
             let pfizer_this_week_vaccines = weeklyArray[week_index].attributes.Pfizer;
             let moderna_this_week_vaccines = weeklyArray[week_index].attributes.Moderna;
             let azen_this_week_vaccines = weeklyArray[week_index].attributes.AstraZeneca;
             let janns_this_week_vaccines = weeklyArray[week_index].attributes.Janssen;
            //console.log(this_week_vaccines);
            //console.log("This week number " + this_week_number)
            weeklyArray.forEach(function(obj){
                total_figure = total_figure + obj.attributes.TotalweeklyVaccines

            })
            //console.log("Total vaccinated",total_figure);
            //setting the text of the htnml to display total(2021) and weekly vaccination figures
            document.getElementById("disp_total_vac").innerHTML= "Total vaccinations 2021" + " cumulative to week " + this_week_number;
            document.getElementById ("total_vac_big").innerHTML = total_figure;
            document.getElementById("vac_this_week").innerHTML = "Total Overall vaccinations "+ "week "+ this_week_number +": " + this_week_vaccines;
            document.getElementById("pfiz_this_week").innerHTML = "Total Pfizer vaccinations " + "week "+ this_week_number +": " + pfizer_this_week_vaccines;
            document.getElementById("mod_this_week").innerHTML = "Total Moderna vaccinations " + "week "+ this_week_number +": " + moderna_this_week_vaccines;
            document.getElementById("azen_this_week").innerHTML = "Total AstraZeneca vaccinations " + "week "+ this_week_number +": " + azen_this_week_vaccines;
            document.getElementById("janns_this_week").innerHTML = "Total Janssen vaccinations " + "week "+ this_week_number +": " + janns_this_week_vaccines;
            document.getElementById("data_4_week").innerHTML = "Displaying data for week:  " + this_week_number;
            document.getElementById("info_to_user").innerHTML = "Vaccination data displayed as most recent week by default. Enter a week number in the field below to view data for other weeks."
        }

        //END Weekly Vaccine Data JS

        //BEGIN Per Age Data JS

        // reading in the weekly vaccination data using JSON.parse
            let parsedbyAgeWeekly;
            let xmlhttp2 = new XMLHttpRequest();
            const url_perAge = "https://services-eu1.arcgis.com/z6bHNio59iTqqSUY/arcgis/rest/services/COVID19_Weekly_Vaccination_Figures/FeatureServer/0/query?where=1%3D1&outFields=Week,FullyPer_Age10to19,FullyPer_Age20to29,FullyPer_Age30to39,FullyPer_Age40to49,FullyPer_Age50to59,FullyPer_Age60to69,FullyPer_Age70to79,FullyPer_80_,FullyPer_NA,FullyCum_NA,FullyCum_80_,FullyCum_Age70to79,FullyCum_Age60to69,FullyCum_Age50to59,FullyCum_Age40to49,FullyCum_Age30to39,FullyCum_Age20to29,FullyCum_Age10to19&outSR=4326&f=json";

            xmlhttp2.onreadystatechange = function() {
            if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {

                //Parse the JSON daily data to a JavaScript variable. 
                parsedbyAgeWeekly= JSON.parse(xmlhttp2.responseText);
                let firstWeekbyAge = parsedbyAgeWeekly.features[0].attributes.TotalweeklyVaccines
                let weeklyAgeArray = parsedbyAgeWeekly.features;
                weeklyAgeArray = weeklyAgeArray.slice(1,weeklyAgeArray.length);
                let week_number = weeklyAgeArray.length;
                

                //let parse_to_array = Object.keys(parsedWeekly.features)
                //console.log(parse_to_array)
                userWeekparsedByAgeArray(parsedbyAgeWeekly,week_number)

            }
         };

            xmlhttp2.open("GET", url_perAge, true);
            xmlhttp2.send();
            //END read in weekly vaccination data
            // this function returns the vaccination data per age group as whole numbers
            function userWeekparsedByAgeArray(parsedbyAgeWeekly,user_week_in) {
            userweeklyAgeArray = parsedbyAgeWeekly.features;
             //slice the array to exclude first element which is a 2020 figure(2021 only in this project)
             let week_number = Number(user_week_in);
             let end_of_array = Number(week_number + 1)
             let week_index = week_number -1;
            //console.log("age week index",week_index)
             userweeklyAgeArray = userweeklyAgeArray.slice(1,end_of_array);
             //console.log("LOOK HERE FOR WEEKLY ARRAY BY AGE",userweeklyAgeArray)
    
             //creating variable for total 2021 total vaccination
             total_figure = 0;
             //creating a variable that represennts the total weeklyVaccines figure in the last object in the weeklyArray(ie. this is the most recent week)
             let this_week_number = week_number;
             let FullyCum_80_ = userweeklyAgeArray[week_index].attributes.FullyCum_80_;
             let FullyCum_Age70to79 = userweeklyAgeArray[week_index].attributes.FullyCum_Age70to79;
             let FullyCum_Age60to69 = userweeklyAgeArray[week_index].attributes.FullyCum_Age60to69;
             let FullyCum_Age50to59 = userweeklyAgeArray[week_index].attributes.FullyCum_Age50to59;
             let FullyCum_Age40to49 = userweeklyAgeArray[week_index].attributes.FullyCum_Age40to49;
             let FullyCum_Age30to39 = userweeklyAgeArray[week_index].attributes.FullyCum_Age30to39;
             let FullyCum_Age20to29 = userweeklyAgeArray[week_index].attributes.FullyCum_Age20to29;
             let FullyCum_Age10to19 = userweeklyAgeArray[week_index].attributes.FullyCum_Age10to19;
             let FullyCum_NA = userweeklyAgeArray[week_index].attributes.FullyCum_NA;

             //console.log("this is the week number returned",week_number);
            //setting the text of the inner.html to display total(2021) and weekly vaccination figures
             
            document.getElementById("FullyCum_80_").innerHTML = "Fully vaccinated age 80+: " + FullyCum_80_;
            document.getElementById("FullyCum_Age70to79").innerHTML = "Fully vaccinated age 70 - 79: " + FullyCum_Age70to79;
            document.getElementById("FullyCum_Age60to69").innerHTML = "Fully vaccinated age 60 - 69: " + FullyCum_Age60to69;
            document.getElementById("FullyCum_Age50to59").innerHTML = "Fully vaccinated age 50 - 59: " + FullyCum_Age50to59;
            document.getElementById("FullyCum_Age40to49").innerHTML = "Fully vaccinated age 40 - 49: " + FullyCum_Age40to49;
            document.getElementById("FullyCum_Age30to39").innerHTML = "Fully vaccinated age 30 - 39: " + FullyCum_Age30to39;
            document.getElementById("FullyCum_Age20to29").innerHTML = "Fully vaccinated age 20 - 29: " + FullyCum_Age20to29;
            document.getElementById("FullyCum_Age10to19").innerHTML = "Fully vaccinated age 10 - 19: " + FullyCum_Age10to19;
            document.getElementById("FullyCum_NA").innerHTML = "Fully vaccinated age not defined: " + FullyCum_NA;
            }
            
            //this function gets the vaccinated per age data whick is presented as a decimal value and converts to a percentage
            //function is triggered when the dedicated show as a percentage checkbock is checked
            function userWeekparsedByAgeArrayPercentage(parsedbyAgeWeekly,user_week_in) {
             
             let userweeklyAgeArray = parsedbyAgeWeekly.features;
              
              //slice the array to exclude first element which is a 2020 figure
              
              let week_number = Number(user_week_in);
              let end_of_array = Number(week_number + 1)
              let week_index = week_number -1;
             //console.log("age week index",week_index)
              userweeklyAgeArray = userweeklyAgeArray.slice(1,end_of_array);
              //console.log("LOOK HERE FOR WEEKLY ARRAY BY AGE",userweeklyAgeArray)
     
              //creating a variable that represents the total weeklyVaccines figure according to week selected (most recent week by default)
              //below values represent a percentage value instead of whole number in array
              let this_week_number = week_number;
              let FullyPer_80_ = ((userweeklyAgeArray[week_index].attributes.FullyPer_80_)*100).toFixed(2);
              let FullyPer_Age70to79 = ((userweeklyAgeArray[week_index].attributes.FullyPer_Age70to79)*100).toFixed(2);
              let FullyPer_Age60to69 = ((userweeklyAgeArray[week_index].attributes.FullyPer_Age60to69)*100).toFixed(2);
              let FullyPer_Age50to59 = ((userweeklyAgeArray[week_index].attributes.FullyPer_Age50to59)*100).toFixed(2);
              let FullyPer_Age40to49 = ((userweeklyAgeArray[week_index].attributes.FullyPer_Age40to49)*100).toFixed(2);
              let FullyPer_Age30to39 = ((userweeklyAgeArray[week_index].attributes.FullyPer_Age30to39)*100).toFixed(2);
              let FullyPer_Age20to29 = ((userweeklyAgeArray[week_index].attributes.FullyPer_Age20to29)*100).toFixed(2);
              let FullyPer_Age10to19 = ((userweeklyAgeArray[week_index].attributes.FullyPer_Age10to19)*100).toFixed(2);
              let FullyPer_NA= ((userweeklyAgeArray[week_index].attributes.FullyPer_NA)*100).toFixed(2);

              //console.log("this is the week number returned",week_number);
             //setting the text of the innter.html  content to display total(2021) and weekly vaccination figures
              
             document.getElementById("FullyCum_80_").innerHTML = "Fully vaccinated age 80+: " + FullyPer_80_ + "%";
             document.getElementById("FullyCum_Age70to79").innerHTML = "Fully vaccinated age 70 - 79: " + FullyPer_Age70to79 + "%";
             document.getElementById("FullyCum_Age60to69").innerHTML = "Fully vaccinated age 60 - 69: " + FullyPer_Age60to69 + "%";
             document.getElementById("FullyCum_Age50to59").innerHTML = "Fully vaccinated age 50 - 59: " + FullyPer_Age50to59 + "%" ;
             document.getElementById("FullyCum_Age40to49").innerHTML = "Fully vaccinated age 40 - 49: " + FullyPer_Age40to49 + "%";
             document.getElementById("FullyCum_Age30to39").innerHTML = "Fully vaccinated age 30 - 39: " + FullyPer_Age30to39 + "%";
             document.getElementById("FullyCum_Age20to29").innerHTML = "Fully vaccinated age 20 - 29: " + FullyPer_Age20to29 + "%";
             document.getElementById("FullyCum_Age10to19").innerHTML = "Fully vaccinated age 10 - 19: " + FullyPer_Age10to19 + "%";
             if (FullyPer_NA == "NaN"){
                document.getElementById("FullyCum_NA").innerHTML = "Fully vaccinated age not defined: "  + "API not providing this value as a percentage (Value returned:  " + (userweeklyAgeArray[week_index].attributes.FullyPer_NA)+ ")";
             } else {
                document.getElementById("FullyCum_NA").innerHTML = "Fully vaccinated age not defined: " + FullyPer_NA;
             }
             
             }

  