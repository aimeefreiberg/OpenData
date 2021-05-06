###########################
##	Index Calculation	 ##
###########################



##### prep poverty data

setwd("/Users/aimee/Desktop/Open Data")

num = read.table("poverty_prec_num.csv", sep=",", header = TRUE, na.strings= "NA")

countries = c("Aruba","Afghanistan","Angola","Albania","Andorra","Arab World","United Arab Emirates","Argentina"
			  ,"Armenia","American Samoa","Antigua and Barbuda","Australia","Austria","Azerbaijan","Burundi"
			  ,"Belgium","Benin","Burkina Faso","Bangladesh","Bulgaria","Bahrain","Bahamas, The","Bosnia and Herzegovina"
			  ,"Belarus","Belize","Bermuda","Bolivia","Brazil","Barbados","Brunei Darussalam","Bhutan","Botswana","Central African Republic"
		      ,"Canada","Central Europe and the Baltics","Switzerland","Channel Islands","Chile","China","Cote d'Ivoire","Cameroon"
			  ,"Congo, Dem. Rep.","Congo, Rep.","Colombia","Comoros","Cabo Verde","Costa Rica","Caribbean small states","Cuba"
			  ,"Curacao","Cayman Islands","Cyprus","Czech Republic","Germany","Djibouti","Dominica","Denmark","Dominican Republic"
			  ,"Algeria","East Asia & Pacific (excluding high income)","Early-demographic dividend","East Asia & Pacific","Europe & Central Asia (excluding high income)"
			  ,"Europe & Central Asia","Ecuador","Egypt, Arab Rep.","Euro area","Eritrea","Spain","Estonia","Ethiopia","European Union","Fragile and conflict affected situations"
			  ,"Finland","Fiji","France","Faroe Islands","Micronesia, Fed. Sts.","Gabon","United Kingdom","Georgia","Ghana","Gibraltar","Guinea","Gambia, The","Guinea-Bissau","Equatorial Guinea"
			  ,"Greece","Grenada","Greenland","Guatemala","Guam","Guyana","High income","Hong Kong SAR, China","Honduras","Heavily indebted poor countries (HIPC)","Croatia","Haiti"
			  ,"Hungary","IBRD only","IDA & IBRD total","IDA total","IDA blend","Indonesia","IDA only","Isle of Man","India","Not classified","Ireland","Iran, Islamic Rep.","Iraq","Iceland","Israel"
			  ,"Italy","Jamaica","Jordan","Japan","Kazakhstan","Kenya","Kyrgyz Republic","Cambodia","Kiribati","St. Kitts and Nevis","Korea, Rep.","Kuwait","Latin America & Caribbean (excluding high income)","Lao PDR"
			  ,"Lebanon","Liberia","Libya","St. Lucia","Latin America & Caribbean","Least developed countries: UN classification","Low income","Liechtenstein","Sri Lanka","Lower middle income","Low & middle income"
			  ,"Lesotho","Late-demographic dividend","Lithuania","Luxembourg","Latvia","Macao SAR, China","St. Martin (French part)","Morocco","Monaco","Moldova","Madagascar"
			  ,"Maldives","Middle East & North Africa","Mexico","Marshall Islands","Middle income","North Macedonia","Mali","Malta","Myanmar","Middle East & North Africa (excluding high income)","Montenegro"
			  ,"Mongolia","Northern Mariana Islands","Mozambique","Mauritania","Mauritius","Malawi","Malaysia","North America","Namibia","New Caledonia","Niger","Nigeria","Nicaragua"
			  ,"Netherlands","Norway","Nepal","Nauru","New Zealand","OECD members","Oman","Other small states","Pakistan","Panama","Peru","Philippines","Palau","Papua New Guinea","Poland"
			  ,"Pre-demographic dividend","Puerto Rico","Korea, Dem. People’s Rep.","Portugal","Paraguay","West Bank and Gaza","Pacific island small states","Post-demographic dividend","French Polynesia"
			  ,"Qatar","Romania","Russian Federation","Rwanda","South Asia","Saudi Arabia","Sudan","Senegal","Singapore","Solomon Islands","Sierra Leone","El Salvador","San Marino","Somalia","Serbia"
			  ,"Sub-Saharan Africa (excluding high income)","South Sudan","Sub-Saharan Africa","Small states","Sao Tome and Principe","Suriname","Slovak Republic","Slovenia","Sweden","Eswatini"
			  ,"Sint Maarten (Dutch part)","Seychelles","Syrian Arab Republic","Turks and Caicos Islands","Chad","East Asia & Pacific (IDA & IBRD countries)","Europe & Central Asia (IDA & IBRD countries)","Togo"
			  ,"Thailand","Tajikistan","Turkmenistan","Latin America & the Caribbean (IDA & IBRD countries)","Timor-Leste","Middle East & North Africa (IDA & IBRD countries)","Tonga","South Asia (IDA & IBRD)"
			  ,"Sub-Saharan Africa (IDA & IBRD countries)","Trinidad and Tobago","Tunisia","Turkey","Tuvalu","Tanzania","Uganda","Ukraine","Upper middle income","Uruguay","United States","Uzbekistan"
			  ,"St. Vincent and the Grenadines","Venezuela, RB","British Virgin Islands","Virgin Islands (U.S.)","Vietnam","Vanuatu","World","Samoa","Kosovo","Yemen, Rep.","South Africa","Zambia","Zimbabwe")

raw_pov = cbind(countries, num)

#extract last 5 years
pov_5 = raw_pov[, c("countries","X2015", "X2016" ,"X2017", "X2018" ,"X2019")]

num_red = num[, 1:20]

#calculate the mean of the last 5 years and generate mean table
means = c()

for(i in 1:length(countries)){
	
	my_mean = mean(as.numeric(pov_5[i, 2:6]), na.rm = TRUE)
	
	means <- c(means, my_mean)
	
	}

mean_pov = cbind(countries, means)

#fill not available data with most recent entry
for(i in 1:length(countries)){
	
	if(mean_pov[i,2] == "NaN"){
		
		for(j in 1:length(colnames(num_red))){

			if(!is.na(num_red[i, j])){
					
				mean_pov[i,2] = num_red[i, j]
			}
			
		}
	}
	
}

# find mean to replace missing values with

the_mean = as.numeric(mean_pov[, 2])
this_one = the_mean[!is.na(the_mean)]
wanted_mean = mean(this_one) # 27.7552688172043

#replace NaN with average mean

for(i in 1:length(countries)){
	
	if(mean_pov[i, 2] == "NaN"){
	
		mean_pov[i, 2] = wanted_mean	
		
	}
	
}

#normalize data

normalize <- function(x) {
	return ((x - min(x)) / (max(x) - min(x)))
	}

normalized_pov_mean = normalize(as.numeric(mean_pov[, 2]))

final_index_data = cbind(countries,normalized_pov_mean)

##### prep ease of business data

busi = read.table("ease_buis.csv", sep=",", header = TRUE, na.strings= "NA")

#find mean and replace missing values

the_mean = as.numeric(busi[, 2])
this_one = the_mean[!is.na(the_mean)]
wanted_mean = mean(this_one) #95.92593

business = busi[,2]

#replace NA with average mean

for(i in 1:length(countries)){
	
	if(is.na(business[i])){
	
		business[i] = wanted_mean	
		
	}
	
}

#normalize data and adjust for 1 - best business , 2 - worst business

normalized_busi = normalize(business)

for(i in 1:length(countries)){

	normalized_busi[i] = 1 - normalized_busi[i]
	
}

final_index_data = cbind(final_index_data, normalized_busi)


##### gini index - equaltiy of funds distribution

gini = read.table("gini_index.csv", sep=",", header = TRUE, na.strings= "NaN")

#extract last 5 years
gini_5 = gini[, c("X2015", "X2016" ,"X2017", "X2018" ,"X2019")]

gini_red = gini[, 2:36]

means = c()

for(i in 1:length(countries)){
	
	my_mean = mean(as.numeric(gini_5[i, ]), na.rm = TRUE)
	
	means <- c(means, my_mean)
	
	}
	
#fill not available data with most recent entry

gini_pov = cbind(countries, means)


for(i in 1:length(countries)){
	
	if(gini_pov[i,2] == "NaN"){			
		
		for(j in 1:length(colnames(gini_red))){

			if(!is.na(gini_red[i, j])){
				gini_pov[i,2] = gini_red[i, j]
			}
			
		}
	}
	
}

#find mean and replace missing values

the_mean = as.numeric(gini_pov[, 2])
this_one = the_mean[!is.na(the_mean)]
wanted_mean = mean(this_one) #38.26795

gini_index = as.numeric(gini_pov[,2])

#replace NA with average mean

for(i in 1:length(countries)){
	
	if(is.na(gini_index[i])){
	
		gini_index[i] = wanted_mean	
		
	}
	
}

#normalize data and adjust for 1 - least equal , 0 - most equal

normalized_gini = normalize(gini_index)

final_index_data = cbind(final_index_data, normalized_gini)

##### gender equality data

gender = read.table("gender_eq.csv", sep=",", header = TRUE, na.strings= "NaN")

#extract last 5 years
gender_5 = gender[, c("X2015", "X2016" ,"X2017", "X2018" ,"X2019")]

gender_red = gender[, 2:56]


#calc mean of last 5 years
means = c()

for(i in 1:length(countries)){
	
	my_mean = mean(as.numeric(gender_5[i, ]), na.rm = TRUE)
	
	means <- c(means, my_mean)
	
	}

#fill not available data with most recent entry

gender_equality  = cbind(countries, means)


for(i in 1:length(countries)){
	
	if(gender_equality[i,2] == "NaN"){			
		
		for(j in 1:length(colnames(gender_red))){

			if(!is.na(gender_red[i, j])){
				gender_equality[i,2] = gender_red[i, j]
			}
			
		}
	}
	
}

#find mean and replace missing values

the_mean = as.numeric(gender_equality[, 2])
this_one = the_mean[!is.na(the_mean)]
wanted_mean = mean(this_one) #3.302096

gender_eq = as.numeric(gender_equality[,2])

#replace NA with average mean

for(i in 1:length(countries)){
	
	if(is.na(gender_eq[i])){
	
		gender_eq[i] = wanted_mean	
		
	}
	
}

normalized_gender_eq = normalize(gender_eq)

#set for 1 meaning most unequal - 0 most equal

for(i in 1:length(countries)){

	normalized_gender_eq[i] = 1 - normalized_gender_eq[i]
	
}

final_index_data = cbind(final_index_data, normalized_gender_eq)


#### children education data

child_ed = read.table("children_school.csv", sep=",", header = TRUE, na.strings= "NaN")

#extract last 5 years
child_5 = child_ed[, c("X2015", "X2016" ,"X2017", "X2018" ,"X2019")]

child_red = child_ed[, 2:56]

means = c()

for(i in 1:length(countries)){
	
	my_mean = mean(as.numeric(child_5[i, ]), na.rm = TRUE)
	
	means <- c(means, my_mean)
	
	}

#fill not available data with most recent entry

child_education = cbind(countries, means)


for(i in 1:length(countries)){
	
	if(child_education[i,2] == "NaN"){			
		
		for(j in 1:length(colnames(child_red))){

			if(!is.na(child_red[i, j])){
				child_education[i,2] = child_red[i, j]
			}
			
		}
	}
	
}

#find mean and replace missing values

the_mean = as.numeric(child_education[, 2])
this_one = the_mean[!is.na(the_mean)]
wanted_mean = mean(this_one) #2994436

children = as.numeric(child_education[,2])

#replace NA with average mean

for(i in 1:length(countries)){
	
	if(is.na(children[i])){
	
		children[i] = wanted_mean	
		
	}
	
}

normalized_child_ed = normalize(children)

final_index_data = cbind(final_index_data, normalized_child_ed)

######calculation of index

### standard index
index = 2*as.numeric(final_index_data[,"normalized_pov_mean"]) + as.numeric(final_index_data[, "normalized_busi"]) + as.numeric(final_index_data[, "normalized_gini"]) + as.numeric(final_index_data[, "normalized_gender_eq"]) + as.numeric(final_index_data[, "normalized_child_ed"])

### focus gender eq

index = 2*as.numeric(final_index_data[,"normalized_pov_mean"]) + as.numeric(final_index_data[, "normalized_busi"]) + as.numeric(final_index_data[, "normalized_gini"]) + 2*as.numeric(final_index_data[, "normalized_gender_eq"]) + as.numeric(final_index_data[, "normalized_child_ed"])


### focus education

index = 2*as.numeric(final_index_data[,"normalized_pov_mean"]) + as.numeric(final_index_data[, "normalized_busi"]) + as.numeric(final_index_data[, "normalized_gini"]) + as.numeric(final_index_data[, "normalized_gender_eq"]) + 2*as.numeric(final_index_data[, "normalized_child_ed"])


#normalize index from 0-10

normalized_index = normalize(gini_index)*10

#combine importan info and export 

country_code = unlist(as.character(gini[,"Country.Code"]))

index_data = cbind(countries, country_code,normalized_index)

###### export index data

final_index_data = cbind(final_index_data[,1], country_code, final_index_data[, 2:6])

write.csv(final_index_data, "poverty_index_data")
#write.csv(index_data, "poverty_index_one.csv")
