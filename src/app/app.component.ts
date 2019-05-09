import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  private startDate = null
  private endDate = null

  totalCost: number
  columns = []
  participants: Participant[] = []
  get: number;

  setStart(date) {
    this.startDate = moment(date.value)
    this.displayTable()
  }
  setEnd(date) {
    this.endDate = moment(date.value)
    this.displayTable()
  }

  displayTable() {
    if(this.startDate && this.endDate) {
      this.buildColumns()
      this.buildParticipants()
    }
  }

  private buildParticipants() {
    if(this.participants.length == 0) {
      this.initParticipants()
    }
    this.initParticipantsStays()
  }

  private initParticipantStays(participant: Participant) {
    participant.stay = []
    for(let i = 0; i < this.columns.length; i++) {
      participant.stay[i] = false
    }
    return participant
  }

  private initParticipantsStays() {
    this.participants.map(participant => {
      return this.initParticipantStays(participant)
    })
  }

  private setParticipantsCosts() {
    let totalNights = this.getTotalNights()
    this.participants.map(participant => {
      participant.cost = this.getStayCount(participant) * (this.totalCost / totalNights)
    })
  }

  private getTotalNights() : number {
    return this.participants.reduce((accumulator, participant) => {
      return accumulator + this.getStayCount(participant)
    }, 0)
  }

  buildCosts() {
    this.setParticipantsCosts()
  }

  addParticipant() {
    this.participants.push({name: '', stay: [], cost: 0})
  }

  private initParticipants() {
    for(let i = 0; i < 5; i++) {
      this.addParticipant()
    }
  }

  private buildColumns() {
    this.columns = []
    let days = 0
    let buffDate = moment(this.startDate)
    days = this.endDate.diff(this.startDate, 'days')
    for(let i = 0; i <= days; i++ ) {
      this.columns.push(buffDate.format('dddd Do'))
      buffDate.add(1, 'days')
    }
  }

  private getStayCount(participant: Participant) : number {
    return participant.stay.filter(s => s === true).length
  }


}

interface Participant {
  name: string
  stay: boolean[]
  cost: number
}