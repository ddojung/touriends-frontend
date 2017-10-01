import param from 'jquery-param';
import leftPad from 'left-pad';

class WhenCtrl {
	static get $inject() {
		return ['CacheSvc', '$http', '$state'];
	}

	constructor(CacheSvc, $http, $state) {
		this.CacheSvc = CacheSvc;
		this.$http = $http;
		this.$state = $state;
		this.dateA = null;
		this.dateB = null;

		this.CacheSvc.get('get_calendar').then((response) => {
			if (response.data.success) {
				this.dateA = new Date(response.data.from + ' 00:00:00');
				this.dateB = new Date(response.data.to + ' 00:00:00');
			}
		})
	}
	goNext() {
		let dateAMonth = leftPad(this.dateA.getMonth() + 1, 2, '0');
		let dateBMonth = leftPad(this.dateB.getMonth() + 1, 2, '0');
		let dateADate = leftPad(this.dateA.getDate(), 2, '0');
		let dateBDate = leftPad(this.dateB.getDate(), 2, '0');

		let from, to;
		if (this.dateA > this.dateB) {
			from = `${this.dateB.getFullYear()}-${dateBMonth}-${dateBDate}`;
			to = `${this.dateA.getFullYear()}-${dateAMonth}-${dateADate}`;
		}
		else {
			from = `${this.dateA.getFullYear()}-${dateAMonth}-${dateADate}`;
			to = `${this.dateB.getFullYear()}-${dateBMonth}-${dateBDate}`;
		}
		console.log('from', from);
		console.log('to', to);

		this.$http({
			method: 'POST',
			url: ajax_url,
			data: param({
				action: 'set_calendar',
				from: from,
				to: to
			})
		}).then((response) => {
			if (response.data.success) {
				this.CacheSvc.reset('get_calendar');
				this.$state.go('where');
			}
		});
	}
}

export default angular.module('touriends.page.when', ['touriends']).controller('WhenCtrl', WhenCtrl).name;