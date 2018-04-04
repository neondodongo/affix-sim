//$(document).ready(function() {


/** Clear current equipment */
    function clearEquipment(equipCount, strEquipId, stage, safs) {
        //console.log("Start clear func");
        if(equipCount > 0) {
        //console.log("Equip count > 0")
            for (var i=0; i < stage.length; i++) {
                if ((stage[i].identifier.includes(strEquipId) && stage[i].slots > 0) || !stage[i].specialAbilityFactor.id == 0) {
                    for (j=0; j<stage[i].slots; j++) {
                        $("#" + j + "-" + strEquipId).empty();
                    }
                    $("#saf-" + strEquipId).val(0);
                    stage[i].abilities = [];
                    stage[i].slots = 0;
                    stage[i].specialAbilityFactor = safs[0];
                    equipCount--;
                    break;
                }
            }
        }
        return equipCount;
    }

    function getIntEquipmentId(strEquipId, stage) {
        for (var i=0; i<stage.length; i++) {
            if (stage[i].identifier.includes(strEquipId)) {
                return i;
            }
        }
    }

    function toggleEquipment(strEquipId, stage) {
        var toggleSpeed = 100;
        for (var i=stage.length-1; i>=0; i--) {
            if (!stage[i].identifier.includes(strEquipId)) {
                $("#" + stage[i].identifier).delay(toggleSpeed).fadeToggle();
                toggleSpeed -= 20;
            }
        }
    }


    function onPageLoad() {
        $("#header").slideToggle(600);
        $("#stage-header-cont").slideToggle(900);
        $("#base").delay(150).fadeToggle();
        $("#e1").delay(250).fadeToggle();
        $("#e2").delay(350).fadeToggle();
        $("#e3").delay(450).fadeToggle();
        $("#e4").delay(650).fadeToggle();
        $("#e5").delay(750).fadeToggle();
        $("#affix-header-cont").delay(1050).fadeToggle();
        $("#commit").attr("disabled", "disabled");
        $("#sr-item").val(0);
        $("#same-eq").val(0);
        $("#total-passes").css("visibility", "hidden");
    }


    function setSafs(stage, safs) {
            for (var i=0; i<stage.length; i++) {
                var safId = $("#saf-" + stage[i].identifier).val();
                stage[i].specialAbilityFactor = safs[0];
                $("#saf-" + stage[i].identifier).val(0);
            }
    }


    function addAbility(selectedAbility, currentEquipment, strEquipId, equipCount) {
        // Get current equipment abilities
        var currentAbilities = currentEquipment.abilities;

        if (!currentAbilities.includes(selectedAbility)) {
            if (currentEquipment.slots > 0 || currentEquipment.specialAbilityFactor.name != "None") {
                for(i=0; i<currentAbilities.length; i++) {
                    var switchable = false;
                    if (currentAbilities[i].abilityType == selectedAbility.abilityType) {
                        var currentType = selectedAbility.abilityType;
                        // Special replacement cases
                        if (currentType == "special") {
                            if ((selectedAbility.name.includes("Modulator") || selectedAbility.name.includes("Vinculum") ||
                                 selectedAbility.name.includes("ARKS MAX")) && (currentAbilities[i].name.includes("Modulator") ||
                                 currentAbilities[i].name.includes("Vinculum") || currentAbilities[i].name.includes("ARKS MAX")))
                            {
                                    switchable = true;
                                    break;
                            }
                            else if ((selectedAbility.name.includes("Boost") || selectedAbility.name.includes("Noble") ||
                                      selectedAbility.name.includes("Elegant")) && (currentAbilities[i].name.includes("Boost") ||
                                      currentAbilities[i].name.includes("Noble") || currentAbilities[i].name.includes("Elegant")))
                            {
                                switchable = true;
                                break;
                            }
                            else if (selectedAbility.name.includes("Factor") && currentAbilities[i].name.includes("Factor")) {
                                switchable = true;
                                break;
                            }
                            else if (selectedAbility.name.includes("Reverie") && currentAbilities[i].name.includes("Reverie")) {
                                switchable = true;
                                break;
                            }
                            else if ((selectedAbility.name.includes("Flict") || selectedAbility.name.includes("Alter")) &&
                                     (currentAbilities[i].name.includes("Flict") || currentAbilities[i].name.includes("Alter")))
                            {
                                switchable = true;
                                break;
                            }
                            else if (selectedAbility.name.split(" ")[0].includes(currentAbilities[i].name.split(" ")[0])) {
                                switchable = true;
                                break;
                            }
                        } //end special
                        else if (currentType == "soul" || currentType == "fever") {
                            switchable = true;
                            break;
                        }
                        else {
                            var splitSelected = selectedAbility.name.split(" ");
                            var splitCurrent = currentAbilities[i].name.split(" ");

                            if (splitSelected[0] == splitCurrent[0]) {
                                switchable = true;
                                break;
                            }
                        }
                    }
                } //end for

                /** Switch or Add ability to equipment */
                if (switchable) {
                    currentAbilities[i] = selectedAbility;
                    // renders ability name to corresponding equipment
                    $("#" + currentAbilities.indexOf(selectedAbility) + "-" + strEquipId).text(selectedAbility.name);
                }
                else {
                    if (currentEquipment.slots < 8) {
                        currentAbilities.push(selectedAbility);
                        $("#" + currentAbilities.indexOf(selectedAbility) + "-" + strEquipId).text(selectedAbility.name);
                        currentEquipment.slots++;
                    }
                    else {
                        console.log("Maximum slots allotted: " + currentEquipment.length)
                    }
                }
            }
            else {
                currentAbilities.push(selectedAbility);
                $("#" + currentAbilities.indexOf(selectedAbility) + "-" + strEquipId).text(selectedAbility.name);
                currentEquipment.slots++;
                equipCount++;
            }
        }
        console.log("Equip Count: ");
        console.log(equipCount);
        return equipCount;
    } //end add ability

    function equipSizeCheck(stage) {
        var ready = false;
        for (i=1; i<stage.length; i++) {
            if (stage[0].slots > 0) {
                if (stage[0].slots <= stage[i].slots || stage[i].slots == 0) {
                    ready = true;
                    continue;
                }
                else {
                    //console.log("Cannot Affix...");
                    ready = false;
                    break;
                }
            }
            else if (stage[0].slots == 0) {
                if (stage[i].slots > 0) {
                    //console.log("All other equipment must at least have the same amount of slots as the base.");
                    ready = false;
                    break;
                }
                else {
                    ready = true;
                }
            }
        } /** End for : equip size check */
        return ready;
    }

    function toggleAffix(affixing) {
        if (!affixing) {
            affixing = true;
            $("#stage").delay(100).fadeToggle();
            $("#affix").delay(500).fadeToggle();
        }
        else {
            affixing = false;
            $("#affix").delay(100).fadeToggle();
            $("#stage").delay(600).fadeToggle();
            $("#pot-affix").empty();
            $("#pass").empty();
            $("#fail").empty();
            $("#final").empty();
        }
        return affixing;
    }

    function successRateOverride(ability, affixableAbilities) {
        if (ability.successRate > 0) {
            if (ability.successRate > 100) {
                ability.successRate = 100;
            }
            affixableAbilities.unshift(ability);
        }
        return affixableAbilities;
    }

    function getSAFs(stage) {
        var safList = [];
        for (var i=0; i<stage.length; i++) {
            if (!safList.includes(stage[i].specialAbilityFactor) && (!stage[i].specialAbilityFactor.name.includes("None"))) {
                safList.push(stage[i].specialAbilityFactor);
            }
        }
        return safList;
    }

    // Gather all user-selected abilities
    function getSelectedAbilities(stage, abilities) {
        var selectedAbilities = {}; // [id:count]
        var mySAFs = getSAFs(stage); // Array of Special Ability Factors
        var mySouls = {}; // [id:ability]

        for (var i=0; i<stage.length; i++) {
            for (var j=0; j<stage[i].abilities.length; j++) {
                if (!selectedAbilities[stage[i].abilities[j].id]) {
                    selectedAbilities[stage[i].abilities[j].id] = 1;
                }
                else {
                    selectedAbilities[stage[i].abilities[j].id] += 1;
                }
            }
        }
        selectedAbilities = mergeSAFs(selectedAbilities, mySAFs, abilities);
        //console.log(selectedAbilities);
        return selectedAbilities;
    }

    function getSouls(selectedAbilities, abilities) {
        var souls = {};
        for (var id in selectedAbilities) {
            if (abilities[id-1].abilityType.includes("soul")) {
                souls[id] = abilities[id-1];
            }
        }
        return souls;
    }

    function mergeSAFs(selectedAbilities, safList, abilities) {
        for (var i=0; i<safList.length; i++) {
            for (var key in selectedAbilities) {
                if (abilities[key-1].name == safList[i].name) {
                    selectedAbilities[key] += 1;
                    break;
                }
            }
        }
        return selectedAbilities;
    }

    function calcSpecificCases(ability, affixableAbilities, selectedAbilities, id) {
        switch (ability.id) {
            case 49: //Modulator
                if (selectedAbilities[id] == 2) {
                    ability.successRate = 30;
                }
                else if (selectedAbilities[id] > 2) {
                    ability.successRate = 80;
                }
                //Apprentice Soul Bonus
                if (selectedAbilities[154]) {
                    ability.successRate = 10;
                }
                break;
            //Mutation and Doom Break
            case 50: case 51: case 64:
                if (selectedAbilities[id] == 2) {
                    ability.successRate = 50;
                }
                else if (selectedAbilities[id] > 2) {
                    ability.successRate = 80;
                    if (ability.name == "Mutation I") {
                        var tempAbility = abilities[id];
                        tempAbility.successRate = 10;
                        affixableAbilities.push(tempAbility);
                    }
                }
                break;
            case 52: //Vinculum
            case 53: //Stigma
            case 94: //ARKS MAX
                if (selectedAbilities[id] == 2) {
                    ability.successRate = 30;
                }
                else if (selectedAbilities[id] > 2) {
                    ability.successRate = 50;
                }
                break;
            //Alter and Flict
            case 54: case 55: case 56: case 57: case 58: case 59:
                if (selectedAbilities[id] > 2) {
                    ability.successRate = 80;
                }
                //Extreceptor check
                if (selectedAbilities[277]) {
                    ability.successRate = 100;
                }
                break;
            case 270: //Soul Catalyst
                if (selectedAbilities[id] == 2) {
                    ability.successRate = 10;
                }
                else if (selectedAbilities[id] > 2) {
                    ability.successRate = 30;
                }
                break;
            default:
                //console.log("Case not met.");
                break;
        }
        affixableAbilities = successRateOverride(ability, affixableAbilities);
        return affixableAbilities;
    }

    function calcBasicResist(ability, nextAbility, selectedAbilities, id, affixableAbilities) {
        // Determine current ability success rate and create fusion abilities if applicable
        if (selectedAbilities[id] == 2) {
            ability.successRate += 20;
            if (ability.name.split(" ")[0] == nextAbility.name.split(" ")[0]) {
                if (ability.name.includes("III") || ability.name.includes("IV")) {
                    nextAbility.successRate /= 2;
                }
                affixableAbilities.unshift(nextAbility);
            }
        }
        else if (selectedAbilities[id] > 2) {
            ability.successRate += 40;
            if (ability.name.split(" ")[0] == nextAbility.name.split(" ")[0]) {
                if (ability.name.includes("III")) {
                    nextAbility.successRate = (nextAbility.successRate / 2) + 20;
                }
                affixableAbilities.unshift(nextAbility);
            }
        }
        if (ability.successRate > 0) {
            if (ability.successRate > 100) { //success rate cannot exceed 100
                ability.successRate = 100;
            }
            affixableAbilities.unshift(ability);
        }
        //Priority to highest inherent/calculated success rate of same ability name
        for (var i=0; i<affixableAbilities.length; i++) {
            if (ability.name == affixableAbilities[i].name) {
                if (ability.successRate > affixableAbilities[i].successRate) {
                    affixableAbilities[i] = ability;
                }
            }
        }
        return affixableAbilities;
    }

    function calcStatusEffect(ability, nextAbility, selectedAbilities, id, affixableAbilities) {
        if (selectedAbilities[id] == 2) {
            ability.successRate += 20;
            if (ability.name.split(" ")[0] == nextAbility.name.split(" ")[0]) {
                if (!ability.name.includes("II") || !ability.name.includes("IV")) {
                    nextAbility.successRate = ability.successRate;
                }
                affixableAbilities.unshift(nextAbility);
            }
        }
        else if (selectedAbilities[id] > 2) {
            ability.successRate += 40;
            if (ability.name.split(" ")[0] == nextAbility.name.split(" ")[0]) {
                if (ability.name.includes("II") || ability.name.includes("IV")) {
                    nextAbility.successRate += 20;
                }
                else {
                    nextAbility.successRate = ability.successRate + 20;
                }
                affixableAbilities.unshift(nextAbility);
            }
        }
        if (ability.successRate > 0) {
            if (ability.successRate > 100) { //success rate cannot exceed 100
                ability.successRate = 100;
            }
            affixableAbilities.unshift(ability);
        }
        //Priority to highest inherent/calculated success rate of same ability name
        for (var i=0; i<affixableAbilities.length; i++) {
            if (ability.name == affixableAbilities[i].name) {
                if (ability.successRate > affixableAbilities[i].successRate) {
                    affixableAbilities[i] = ability;
                }
            }
        }
        return affixableAbilities;
    }

    function calcSouls(ability, affixableAbilities, selectedAbilities, id, soulMap) {
        if (ability.name != "Soul Receptor" && selectedAbilities[268]) { // Soul Receptor Bonus Priority
            console.log("Soul: ");
            console.log(ability.name);
            if (ability.id == 159) { // Astral Soul
                ability.successRate += 10;
            }
            else if ([66, 67, 68, 69].includes(ability.id)) {
                ability.successRate += 50;
            }
            else {
                ability.successRate = 100;
            }
            affixableAbilities.push(ability);
            return affixableAbilities;
        }
        else {
            if (selectedAbilities[id] == 2) {
                if ([160, 161, 163].includes(ability.id)) { // Toh'oh, Full Vegas, Fabula
                    ability.successRate += 60;
                }
                else {
                    ability.successRate += 50;
                }
            }
            else if (selectedAbilities[id] > 2) {
                if ([160, 161, 163].includes(ability.id)) {
                    ability.successRate += 90;
                }
                else {
                    ability.successRate += 80;
                }
            }
        }
        if (ability.successRate > 0) {
            affixableAbilities.push(ability);
        }
        return affixableAbilities;
    }

    function createFusionSouls(selectedAbilities, soulMap, abilities, affixableAbilities) {
        var tempAbility = {};

        if (soulMap[102] || soulMap[103] || soulMap[104] || soulMap[106] || soulMap[113] ||
            soulMap[126] || soulMap[129] || soulMap[131] || soulMap[134] || soulMap[138] ||
            soulMap[139] || soulMap[144] || soulMap[150])
        {
            if (soulMap[160] || soulMap[161] || soulMap[162] || soulMap[163]) {
                /**  Act, Till, Magi, Ares the Soul */
                for (var i=165; i<169; i++) {
                    tempAbility = Object.assign({}, abilities[i]);
                    tempAbility.successRate = 70;
                    affixableAbilities.push(tempAbility);
                }
            }
        }
        if ((soulMap[160] && (soulMap[161] || soulMap[162])) ||
            (soulMap[161] && (soulMap[160] || soulMap[162])) ||
            (soulMap[162] && (soulMap[160] || soulMap[161])))
        {
            // Ether Soul
            tempAbility = Object.assign({}, abilities[164]);
            tempAbility.successRate = 10;
            affixableAbilities.push(tempAbility);
        }
        if (soulMap[120] && soulMap[135] && soulMap[146] && soulMap[154] && soulMap[157]) {
            // Soul Catalyst
            tempAbility = Object.assign({}, abilities[169]);
            tempAbility.successRate = 10;
            affixableAbilities.push(tempAbility);
        }
        if (selectedAbilities[270] > 3 && soulMap[158]) {
            // Astral Soul
            tempAbility = Object.assign({}, abilities[158]);
            tempAbility.successRate = 60;
            affixableAbilities.push(tempAbility);
        }
        return affixableAbilities;
    }

    function safOverride(affixableAbilities, safList) {
        for (var i=0; i<safList.length; i++) {
            var counter = 0;
            for (var j=0; j<affixableAbilities.length; j++) {
                if (safList[i].name == affixableAbilities[j].name) {
                    affixableAbilities[j].successRate = 100;
                    break;
                }
                else {
                    counter++;
                }
            }
            //Add SAF to affixableAbilities if no match is found
            if (counter == affixableAbilities.length) {
                affixableAbilities.push(safList[i]);
            }
        }
        return affixableAbilities;
    }


    //Determine which user-selected abilities are eligible for transfer
    function getAffixableAbilities(selectedAbilities, safList, soulMap, abilities) {
        var affixableAbilities = []; // Eligible abilities for affix
        var currentAbility = {};
        var nextAbility = {};

        for (var id in selectedAbilities) {
            currentAbility = Object.assign({}, abilities[id-1]);
            nextAbility = Object.assign({}, abilities[id]);
            //Basic and Resist Ability Types
            if (currentAbility.abilityType == "basic" || currentAbility.abilityType == "resist") {
                affixableAbilities = calcBasicResist(currentAbility, nextAbility, selectedAbilities, id, affixableAbilities);
            }
            else if (currentAbility.abilityType == "status") {
                affixableAbilities = calcStatusEffect(currentAbility, nextAbility, selectedAbilities, id, affixableAbilities);
            }
            else if (currentAbility.abilityType == "soul") {
                affixableAbilities = calcSouls(currentAbility, affixableAbilities, selectedAbilities, id, soulMap);
            }
            //Specific cases i.e. Modulator, Vinculum, Alter Arma...
            else if ((id > 48 && id < 60) || [64, 90, 270].indexOf(id)) {
                affixableAbilities = calcSpecificCases(currentAbility, affixableAbilities, selectedAbilities, id);
            }
            else {
                affixableAbilities.push(currentAbility);
            }
            console.log("====================");
            console.log(currentAbility);
            console.log("====================");
        }
        // Create and add Fusion Souls
        affixableAbilities = createFusionSouls(selectedAbilities, soulMap, abilities, affixableAbilities);
        // Add safs and override abilities of same name
        affixableAbilities = safOverride(affixableAbilities, safList);

        return affixableAbilities;
    }

    function renderAffixableAbilities(affixableAbilities) {
        for (var i=0; i<affixableAbilities.length; i++) {
                $("#pot-affix").append("<tr><td>" + affixableAbilities[i].name + "</td><td>" +
                                        affixableAbilities[i].successRate + "%" + "<td><input id='" +
                                        affixableAbilities[i].name + "' class='chk' name='" +
                                        affixableAbilities[i].name + "' value='" +
                                        affixableAbilities[i].successRate +
                                        "' type='checkbox'/></td></tr>");
        }
    }

    function getMyAffix(affixableAbilities, name, successRate, myAffix) {
        if (Object.keys(myAffix).length > 0) {
            for (var key in myAffix) {
                if (key == name || (key.includes("Soul", 4) && name.includes("Soul", 4)) ||
                    key.split(" ")[0].includes(name.split(" ")[0]) ||
                    (["Modulator", "Vinculum", "ARKS MAX"].includes(key) &&
                     ["Modulator", "Vinculum", "ARKS MAX"].includes(name)) ||
                     (["Flict", "Alter"].includes(key.split(" ")[0]) && ["Flict", "Alter"].includes(name.split(" ")[0])))
                {
                    document.getElementById(key).checked = false;
                    delete myAffix[key];
                    break;
                }
            }
        }
        myAffix[name] = successRate;
        return myAffix;
    }

    function calcUpslotPenalty(myAffix, stage, equipCount, affixableAbilities) {
        var penalty = 1;
        var finalAffix = {};
        if (Object.keys(myAffix).length > stage[0].slots) {
            if (stage[0].slots == 1) {
                if (equipCount == 1) {
                    penalty = .85;
                }
                else if (equipCount > 1) {
                    penalty = .9;
                }
            }
            else if (stage[0].slots == 2) {
                if (equipCount == 1) {
                    penalty = .75;
                }
                else if (equipCount > 1) {
                    penalty = .85;
                }
            }
            else if (stage[0].slots == 3) {
                if (equipCount == 1) {
                    penalty = .6;
                }
                else if (equipCount > 1) {
                    penalty = .7;
                }
            }
            else if (stage[0].slots == 4) {
                if (equipCount == 1) {
                    penalty = .5;
                }
                else if (equipCount > 1) {
                    penalty = .6;
                }
            }
            else if (stage[0].slots == 5) {
                if (equipCount == 1) {
                    penalty = .45;
                }
                else if (equipCount > 1) {
                    penalty = .55;
                }
            }
            else if (stage[0].slots == 6) {
                if (equipCount == 1) {
                    penalty = .35;
                }
                else if (equipCount > 1) {
                    penalty = .4;
                }
            }
            else if (stage[0].slots == 7) {
                if (equipCount == 1) {
                    penalty = .3;
                }
                else if (equipCount > 1) {
                    penalty = .35;
                }
            }
        }
        // Apply upslot penalty
        for (var key in myAffix) {
            if (penalty < 1) {
                console.log("penalized");
                finalAffix[key] = Math.floor(myAffix[key] * penalty);
            }
            else {
            console.log("not penalized");
                for (var i=0; i<affixableAbilities.length; i++) {
                    if (key == affixableAbilities[i].name) {
                        finalAffix[key] = affixableAbilities[i].successRate;
                    }
                }
            }
        }
        return finalAffix;
    }

    function renderResult(finalAffix) {
        var randNum = null;
        var counter = 0;
        for (var key in finalAffix) {
            //Generate random number for each key
            randNum = Math.floor(Math.random() * 100) + 1;
            if (randNum <= finalAffix[key]) {
                counter++;
                $("#pass").append("<tr style='border-bottom: solid; border-color: #81d9f4; font-size: 18px;'><td>" + key + "</td><td>" + finalAffix[key] + "%" + "</td></tr>");
            }
            else {
                $("#fail").append("<tr style='border-bottom: solid; border-color: #81d9f4; font-size: 18px;'><td>" + key + "</td><td>" + finalAffix[key] + "%" + "</td></tr>");
            }
        }
        if (counter == Object.keys(finalAffix).length) {
            return true;
        }
        else {
            return false;
        }
    }

    function renderFinalAffix(affixMap) {
        for (var key in affixMap) {
            $("#final").append("<tr><span><td>" + key + "</td><td>" + affixMap[key] + "%" + "</td></span></tr>");
        }
    }

//})