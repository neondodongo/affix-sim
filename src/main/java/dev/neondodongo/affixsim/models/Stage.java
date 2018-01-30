package dev.neondodongo.affixsim.models;

import java.util.ArrayList;

public class Stage {

    ArrayList<Equipment> equipment;

    public Stage() {
        equipment = new ArrayList<>();
        equipment.add(new Equipment("Base", "base"));
        equipment.add(new Equipment("Equipment 1", "e1"));
        equipment.add(new Equipment("Equipment 2", "e2"));
        equipment.add(new Equipment("Equipment 3", "e3"));
        equipment.add(new Equipment("Equipment 4", "e4"));
        equipment.add(new Equipment("Equipment 5", "e5"));
    }

    public ArrayList<Equipment> getEquipment() {
        return equipment;
    }
}
