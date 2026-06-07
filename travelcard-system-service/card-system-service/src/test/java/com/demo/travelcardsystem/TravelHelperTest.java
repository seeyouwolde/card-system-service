package com.demo.travelcardsystem;

import com.demo.travelcardsystem.constant.TransportType;
import com.demo.travelcardsystem.constant.Zone;
import com.demo.travelcardsystem.entity.Station;
import com.demo.travelcardsystem.entity.TravelCard;
import com.demo.travelcardsystem.entity.TravelCardObserver;
import com.demo.travelcardsystem.model.request.SwipeRequest;
import com.demo.travelcardsystem.repository.InMemoryCardTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Component
public class TravelHelperTest {

    @Autowired
    private InMemoryCardTransactionRepository inMemoryCardTransactionRepository;
    @Autowired
    private TravelCardObserver travelCardObserver; // Inject TravelCardObserver


    public  SwipeRequest prepareSwipeRequest(String cardNumber, String stationName, TransportType transportType) {
        SwipeRequest swipeRequest = new SwipeRequest();
        swipeRequest.setCardNumber(cardNumber);
        swipeRequest.setStationName(stationName);
        swipeRequest.setTransportType(transportType);

        return swipeRequest;
    }


    public TravelCard directUserRegistration(String cardNumber, double amount) {
        TravelCard travelCard = new TravelCard();
        travelCard.setCardNumber(cardNumber);
        travelCard.setBalance(amount);
        travelCard.registerObserver(travelCardObserver); // Register the observer

       return inMemoryCardTransactionRepository.registerNewCard(travelCard);
    }

    public void loadStationsForTest() {
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

        inMemoryCardTransactionRepository.addAllStationsToStationStore(stations);
    }
}
