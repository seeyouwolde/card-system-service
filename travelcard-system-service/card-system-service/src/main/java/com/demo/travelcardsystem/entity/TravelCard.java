package com.demo.travelcardsystem.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
public class TravelCard implements Observable {

    @Id
    private String cardNumber;

    private double balance;

    @Transient
    private Journey currentJourney;

    @Transient
    private List<Observer<TravelCard>> observers = new ArrayList<>();

    public TravelCard() {
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public Journey getCurrentJourney() {
        return currentJourney;
    }

    public void setCurrentJourney(Journey currentJourney) {
        this.currentJourney = currentJourney;
    }

    public synchronized void addCredit(double amount) {
        balance += amount;
    }

    public synchronized void debitAmount(double amount) {
        balance -= amount;
    }

    @Override
    public void notifyAllObservers() {
        observers.forEach(observer -> observer.reactOnChange(this));
    }

    @Override
    public void registerObserver(Observer<TravelCard> observer) {
        if (!observers.contains(observer)) {
            observers.add(observer);
        }
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) {
            return true;
        }

        if (!(object instanceof TravelCard)) {
            return false;
        }

        TravelCard that = (TravelCard) object;
        return Objects.equals(cardNumber, that.cardNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(cardNumber);
    }
}