package dev.neondodongo.affixsim.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

@Entity
public class SpecialAbilityFactor {
    @Id
    @GeneratedValue
    private int id;

    @NotNull
    private String name;

    @NotNull
    private int successRate;

    public SpecialAbilityFactor() {}

    public SpecialAbilityFactor(int id, String name, int successRate) {
        this.name = name;
        this.successRate = successRate;
    }


    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getSuccessRate() {
        return successRate;
    }

}
