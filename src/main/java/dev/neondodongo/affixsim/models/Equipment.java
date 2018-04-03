package dev.neondodongo.affixsim.models;

import java.util.ArrayList;

public class Equipment {

    private ArrayList<Ability> abilities;
    private SpecialAbilityFactor specialAbilityFactor;
    private String title;
    private String identifier;
    private int slots;

    //Constructor
    public Equipment() {}

    public Equipment(String title, String identifier) {
        abilities = new ArrayList<>();
        this.title = title;
        this.identifier = identifier;
        this.slots = 0;
    }

    public ArrayList<Ability> getAbilities() {
        return abilities;
    }

    public SpecialAbilityFactor getSpecialAbilityFactor() {
        return specialAbilityFactor;
    }

    public int getSlots() {
        return slots;
    }

    public String getTitle() {
        return title;
    }

    public String getIdentifier() {
        return identifier;
    }
}
