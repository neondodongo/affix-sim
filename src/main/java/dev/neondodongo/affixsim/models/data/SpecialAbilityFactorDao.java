package dev.neondodongo.affixsim.models.data;

import dev.neondodongo.affixsim.models.SpecialAbilityFactor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import javax.transaction.Transactional;

@Repository
@Transactional
public interface SpecialAbilityFactorDao extends CrudRepository<SpecialAbilityFactor, Integer> {

}
