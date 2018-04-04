$(document).ready(function(){

        var equipCount = 0;
        var strEquipId = "";
        var intEquipId = null;
        var adding = false;
        var affixing = false;
        var passed = false; // Initialize complete pass bool for affix
        var commitCount = 0; // Initialize counter for commit button clicks
        var passedCount = 0; // Initialize counter for complete passes
        var affixableAbilities = []; // List for Ability objects
        var abilityMap = {}; /** Map of all equipments' abilities (abilityId : count) */
        var soulMap = {}; /** Map holding all equipments' soul-type abilities (abilityId : ability) */
        var safList = []; /** List of all selected SpecialAbilityFactor objects */
        var myAffix = {}; /** Map of Ability objects to transfer (abilityName : successRate) */
        var myAffixBoosted = {}; /** Map to hold altered myAffix with success rate boosts */

        onPageLoad();
        setSafs(stage, safs);

        $(".add").click(function() {
            strEquipId = $(this).parent().parent().prop("id");
            intEquipId = getIntEquipmentId(strEquipId, stage);
            if (!adding) {
                toggleEquipment(strEquipId, stage);
                $("#add-" + strEquipId).text("Back");
                $("#search").delay(500).fadeToggle(1000);
                adding = true;
            }
            else {
                $("#add-" + strEquipId).text("Add");
                $("#search").toggle();
                toggleEquipment(strEquipId, stage);
                adding = false;
            }
            console.log("Current Equipment: " + strEquipId);
        });

        $(".junk").click(function() {
            // TODO: Function that fills current equipment with "Junk" objects at user-determined size
            console.log("Not yet implemented.");
        });

        /** Clear current equipment */
        $(".clear").click(function() {
            strEquipId = $(this).parent().parent().prop("id");
            equipCount = clearEquipment(equipCount, strEquipId, stage, safs);
                        console.log("Equip Count: ");
                        console.log(equipCount);
            console.log("CLEARED EQUIPMENT");
            console.log("Equip Count: ");
            console.log(equipCount);
        });


        $(".saf").change(function() {
            strEquipId = $(this).parent().parent().prop("id");

            for (var i=0; i<stage.length; i++) {
                if (stage[i].identifier.includes(strEquipId)) {
                    if (stage[i].specialAbilityFactor.name == "None" && stage[i].slots == 0) {
                        equipCount++;
                    }
                    else {
                        console.log("Equip Count: ");
                        console.log(equipCount);
                    }
                    stage[i].specialAbilityFactor = safs[this.value];
                    break;
                }
            }
            console.log("Selected SAF: ");
            console.log(safs[this.value].name);
        });

        /** Enable enter key to add ability */
        $("#basic, #special, #soul, #resist, #status, #other").keydown(function(event) {
            if (event.which === 13) {
                $(document.activeElement).dblclick();
            }
        });


        /** Serves to properly add the selected ability to a particular equipment */
        $("#basic, #special, #soul, #resist, #status, #other").dblclick(function() {
            // Get selected ability
            var selectedAbility = abilities[this.value - 1];
            console.log("Selected: " + selectedAbility.name);

            // Get current equipment
            var currentEquipment = stage[intEquipId];
            equipCount = addAbility(selectedAbility, currentEquipment, strEquipId, equipCount);
        });

        /** Show user all transferable abilities including fusions */
        $("#affix-header").click(function() {
            //Empty any previous populations
            affixableAbilities = [];
            myAffix = {};
            abilityMap = {};
            soulMap = {};
            safList = [];

            /** Cannot affix if other equipment have less slots than base */
            if (equipSizeCheck(stage)) {
                affixing = toggleAffix(affixing);
                $("#same-eq-div").css("visibility", "hidden");
                $("#same-eq").prop("checked", false);
                $("#upslot-penalty").css("visibility", "hidden");
                $("#ability-counter").text("Selected: 0/" + stage[0].slots);
                $(".result").css("visibility", "hidden");
                $("#commit").attr("disabled", "disabled");
                $("#commit").css("opacity", "0.4");
                $("#sr-item").val(0);
                $("#same-eq").val(0);


                if (affixing) {
                    myAffix = {};
                    myAffixBoosted = {};

                    abilityMap = getSelectedAbilities(stage, abilities);

                    console.log("Selected Abilities: ");
                    console.log(abilityMap);

                    safList = getSAFs(stage);
                    soulMap = getSouls(abilityMap, abilities);

                    console.log("Selected SAFs: ");
                    console.log(safList);

                    /* Get and put all transferable abilities into an array
                     * Calculates success rates based on quantities of each ability
                     * Creates 'fusion' abilities with appropriate penalties */
                    affixableAbilities = getAffixableAbilities(abilityMap, safList, soulMap, abilities);

                    console.log("Affixable Abilities: ");
                    console.log(affixableAbilities);

                    // Show user each ability name with success rates
                    renderAffixableAbilities(affixableAbilities);
                }
            }
            else {
                alert("All incorporated equipment must have at least " + stage[0].slots + " abilities.");
            }
        });

        $(document).on("click", ".chk", function() {
            if (this.id != "same-eq") {
                $("#final").empty();
                $("#pass").empty();
                $("#fail").empty();
                $("#same-eq").prop("checked", false);
                if (this.checked) {
                    myAffix = getMyAffix(affixableAbilities, this.name, this.value, myAffix);
                }
                else {
                    delete myAffix[this.name];
                }
                if (Object.keys(myAffix).length == stage[0].slots) {
                    myAffixBoosted = {};
                    $("#upslot-penalty").css("visibility", "hidden");
                    $("input:checkbox:not(:checked)").removeAttr("disabled");
                    $("input:checkbox:not(:checked)").parent().parent().css("opacity", "1");
                    $("#same-eq-div").css("visibility", "visible");
                    $("#commit").removeAttr("disabled");
                    $("#commit").css("opacity", "1");
                    $(".result").css("visibility", "visible");
                }
                else if (Object.keys(myAffix).length > stage[0].slots) {
                    $("#upslot-penalty").css("visibility", "visible");
                    $("input:checkbox:not(:checked)").attr("disabled", "disabled");
                    $("input:checkbox:not(:checked)").parent().parent().css("opacity", "0.4");
                    $("#same-eq-div").removeAttr("opacity");
                    $("#same-eq").attr("disabled", false);
                }
                else {
                    $("#same-eq").prop("checked", false);
                    $("#same-eq-div").css("visibility", "hidden");
                    $("#commit").attr("disabled", "disabled");
                    $("#commit").css("opacity", "0.4");
                    $(".result").css("visibility", "hidden");
                }
            }
            $("#same-eq").val(0);
            $("#sr-item").val(0);
            $("#same-eq-div").css("opacity", "1");
            $("#ability-counter").empty();
            $("#ability-counter").text("Selected: " + Object.keys(myAffix).length + "/" + stage[0].slots);
            $("#total-passes").empty();
            passedCount = 0;
            commitCount = 0;
            myAffix = calcUpslotPenalty(myAffix, stage, equipCount, affixableAbilities);
            renderFinalAffix(myAffix);
        });

        /** Calculate pass/fail for each desired ability */
        $("#commit").click(function() {
            $("#pass").empty();
            $("#fail").empty();
            $("#total-passes").empty();
            $("#total-passes").css("visibility", "visible");
            $(".result").css("visibility", "visible");
            commitCount++;
            if (Object.keys(myAffixBoosted).length > 0) {
                passed = renderResult(myAffixBoosted);
            }
            else {
                passed = renderResult(myAffix);
            }
            if (passed) {
                passedCount++;
            }
            // Render total passes to page
            $("#total-passes").text("Total Passes: " + passedCount + "/" + commitCount + " (" + ((passedCount / commitCount) * 100).toFixed(2) + "%)");
        });

        $("#same-eq, #sr-item").change(function() {
            $("#final").empty();
            $("#total-passes").empty();
            passedCount = 0;
            commitCount = 0;
            var srBonus = parseInt($("#sr-item").val());
            var sameEq = parseInt($("#same-eq").val());

            //Requires copy of myAffix object for usage of original, calculated success rates
            myAffixBoosted = Object.assign({}, myAffix);

            for (var key in myAffixBoosted) {
                if (sameEq == 1 && myAffixBoosted[key] != 100) {
                    myAffixBoosted[key] = Math.floor(myAffix[key] * 1.1);
                    myAffixBoosted[key] += srBonus;
                }
                else if (sameEq == 0 && myAffixBoosted[key] != 100) {
                    myAffixBoosted[key] = myAffix[key];
                    myAffixBoosted[key] += srBonus;
                }
                if (myAffixBoosted[key] > 100) {
                    myAffixBoosted[key] = 100;
                }
            }
            renderFinalAffix(myAffixBoosted);
        });
    });