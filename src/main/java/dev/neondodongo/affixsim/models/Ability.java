package dev.neondodongo.affixsim.models;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
public class Ability {

    @Id
    @GeneratedValue
    private int id;

    @NotNull
    private String name;

    @NotNull
    private String abilityType;

    @NotNull
    private String stats;

    @NotNull
    private int successRate;

    private String boost;


    public Ability(){}


    public Ability(String name, String stats, String abilityType, int successRate, String boost) {
        this.name = name;
        this.stats = stats;
        this.abilityType = abilityType;
        this.successRate = successRate;
        this.boost = boost;
    }

    //getters and setters
    public String getName() {
        return name;
    }

    public int getId() {
        return id;
    }

    public String getAbilityType() {
        return abilityType;
    }

    public String getStats() {
        return stats;
    }

    public int getSuccessRate() {
        return successRate;
    }

    public void addSuccessRate(int bonus) {
        successRate += bonus;
        if (successRate > 100) { //Success rate cannot exceed 100%
            successRate = 100;
        }
    }

    public String getBoost() {
        //returns csv's indicating which other abilities this ability will increase the success rate of
        return boost;
    }
}
