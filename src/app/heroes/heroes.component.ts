import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
	selector: 'app-heroes',
	templateUrl: './heroes.component.html',
	styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

	constructor(private heroService: HeroService, private ms: MessageService) { }

	heroes: Hero[] = [];

	ngOnInit(): void {
		this.getHeroes();
	}

	getHeroes(): void {
		this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
	}

	deleteHero(hero: Hero): void {
		this.heroes = this.heroes.filter(h => h.id !== hero.id);
		this.heroService.deleteHero(hero.id).subscribe();
	}

	addHero(heroName: string): void {
		const name: string = heroName.trim();
		if (!name) { return; }
		this.heroService.addHero({ name } as Hero).subscribe(hero => this.heroes.push(hero));
	}

}
