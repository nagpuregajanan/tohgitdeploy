import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Hero } from './hero';
import { MessageService } from './message.service';
import { HEROES } from './mock-heroes';

@Injectable({
	providedIn: 'root'
})
export class HeroService {

	private heroesUrl: string = 'api/heroes';
	httpOptions = {
		headers: new HttpHeaders({ 'Content-Type': 'application/json' })
	};

	constructor(private messageService: MessageService, private http: HttpClient) { }

	getHeroes(): Observable<Hero[]> {
		return this.http.get<Hero[]>(this.heroesUrl)
			.pipe(
				tap(_ => this.log('fetched heroes')),
				catchError(this.handleError<Hero[]>('getHeroes', []))
			);

	}

	/*	getHeroNo404<Data>(id: number): Observable<Hero> {
			const url = `${this.heroesUrl}/?id=${id}`;
			return this.http.get<Hero[]>(url)
				.pipe(
					map(heroes => heroes[0]), // returns a {0|1} element array
					tap(h => {
						const outcome = h ? 'fetched' : 'did not find';
						this.log(`${outcome} hero id=${id}`);
					}),
					catchError(this.handleError<Hero>(`getHero id=${id}`))
				);
		}
	*/
	getHero(id: number): Observable<Hero> {
		const url = `${this.heroesUrl}/${id}`;
		return this.http.get<Hero>(url).pipe(
			tap(_ => this.log(`fetched hero id=${id}`)),
			catchError(this.handleError<Hero>(`getHero id=${id}`))
		);
	}

	addHero(hero: Hero): Observable<Hero> {
		return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
			.pipe(
				tap((newHero: Hero) => this.log(`added new hero with id:${newHero.id}`)),
				catchError(this.handleError<Hero>(`addHero`))
			);
	}

	updateHero(hero: Hero): Observable<any> {
		return this.http.put(this.heroesUrl, hero, this.httpOptions)
			.pipe(
				tap(_ => this.log(`updated hero id:${hero.id}`)),
				catchError(this.handleError<any>(`updateHero:${hero.id}`))
			);
	}

	deleteHero(id: number): Observable<Hero> {
		const url: string = `${this.heroesUrl}/${id}`;
		return this.http.delete<Hero>(url, this.httpOptions)
			.pipe(
				tap(_ => this.log(`deleted hero with id:${id}`)),
				catchError(this.handleError<Hero>(`deleteHero`))
			);
	}

	searchHeroes(term: string): Observable<Hero[]> {

		if (!term.trim()) {
			return of([]);
		}

		return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
			.pipe(
				tap(x => x.length ? this.log(`found heroes matching "${term}"`) : this.log(`no heroes matching "${term}"`)),
				catchError(this.handleError<Hero[]>(`searchHeroes`, []))
			);
	}


	/**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 *
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {

			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead

			// TODO: better job of transforming error for user consumption
			this.log(`${operation} failed: ${error.message}`);

			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
	}

	private log(msg: string): void {
		this.messageService.add(`HeroService: ${msg}`);
	}
}