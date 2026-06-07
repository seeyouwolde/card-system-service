package com.demo.travelcardsystem.entity;

public interface Observable {
     void notifyAllObservers();

     void registerObserver(Observer<TravelCard> observer);
}