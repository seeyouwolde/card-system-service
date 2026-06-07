package com.demo.travelcardsystem.config;

import com.demo.travelcardsystem.businessrule.RuleCollection;
import com.demo.travelcardsystem.businessrule.TravelStrategy;
import com.demo.travelcardsystem.constant.Zone;
import com.demo.travelcardsystem.entity.Station;
import com.demo.travelcardsystem.entity.TravelCard;
import com.demo.travelcardsystem.entity.TravelCardObserver;
import com.demo.travelcardsystem.repository.InMemoryCardTransactionRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;


@SpringBootApplication(scanBasePackages = {"com.demo.travelcardsystem"})
@EnableJpaRepositories(basePackages = "com.demo.travelcardsystem.repository")
@EntityScan(basePackages = "com.demo.travelcardsystem.entity")


public class TravelcardsystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(TravelcardsystemApplication.class, args);
    }

    @Bean
    public TravelCard getTravelCard(TravelCardObserver travelCardObserver) {
        TravelCard travelCard = new TravelCard();
        travelCard.registerObserver(travelCardObserver);
        return travelCard;
    }

    @Bean
    public RuleCollection loadAllTravelStrategy(TravelStrategy travelStrategy) {
        return travelStrategy.loadAllBusinessRules();
    }

    @Bean
    public Boolean loadAllStation(InMemoryCardTransactionRepository inMemoryCardTransactionRepository) {
        Set<Station> stations = new HashSet<>();

        Station algubaiba = new Station();
        algubaiba.setName("Algubaiba");
        algubaiba.setZones(new HashSet<>(Arrays.asList(Zone.ONE)));
        stations.add(algubaiba);

        Station jumeirah = new Station();
        jumeirah.setName("Jumeirah");
        jumeirah.setZones(new HashSet<>(Arrays.asList(Zone.ONE, Zone.TWO)));
        stations.add(jumeirah);

        Station burDubai = new Station();
        burDubai.setName("Bur Dubai");
        burDubai.setZones(new HashSet<>(Arrays.asList(Zone.THREE)));
        stations.add(burDubai);

        Station deirah = new Station();
        deirah.setName("Deirah");
        deirah.setZones(new HashSet<>(Arrays.asList(Zone.TWO)));
        stations.add(deirah);

        return inMemoryCardTransactionRepository.addAllStationsToStationStore(stations);
    }

    @Bean
    public Boolean loadInitialCards(
            InMemoryCardTransactionRepository inMemoryCardTransactionRepository,
            TravelCardObserver travelCardObserver) {

        TravelCard firstTravelCard = new TravelCard();
        firstTravelCard.setCardNumber("A101");
        firstTravelCard.setBalance(30);
        firstTravelCard.registerObserver(travelCardObserver);

        TravelCard secondTravelCard = new TravelCard();
        secondTravelCard.setCardNumber("B201");
        secondTravelCard.setBalance(50);
        secondTravelCard.registerObserver(travelCardObserver);

        inMemoryCardTransactionRepository.registerNewCard(firstTravelCard);
        inMemoryCardTransactionRepository.registerNewCard(secondTravelCard);

        return true;
    }
}