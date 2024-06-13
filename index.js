const { Extension, log, INPUT_METHOD, PLATFORMS } = require('deckboard-kit');
const si = require('systeminformation');

class SystemInfo extends Extension {
	constructor(props) {
		super(props);
		this.setValue = props.setValue;
		this.name = 'System Info';
		this.platforms = [PLATFORMS.WINDOWS, PLATFORMS.MAC, PLATFORMS.LINUX];

		this.inputs = [
			{
				label: 'Display CPU Stats',
				value: 'si-cpu',
				icon: 'headphones',
				mode: 'graph',
				fontIcon: 'fas',
				color: '#8E44AD',
				input: [
					{
						label: 'Select monitor',
						type: INPUT_METHOD.INPUT_SELECT,
						items: [
							{ value: 'si-load-cpu', label: 'CPU Load' },
							{
								value: 'si-temperature-cpu',
								label: 'CPU Temperature',
							},
						],
					},
				],
				display: {
					type: 'graph',
					defaultTitle: 'CPU',
				},
			},
			{
				label: 'Display RAM Stats',
				value: 'si-ram',
				icon: 'headphones',
				mode: 'graph',
				fontIcon: 'fas',
				color: '#8E44AD',
				input: [
					{
						label: 'Select monitor',
						type: INPUT_METHOD.INPUT_SELECT,
						items: [
							{ value: 'si-load-p-ram', label: 'RAM Usage (%)' },
							{
								value: 'si-load-gb-ram',
								label: 'RAM Usage (GB)',
							},
						],
					},
				],
				display: {
					type: 'graph',
					defaultTitle: 'RAM',
				},
			},
		];
		this.configs = [];
	}

	// Executes when the extensions loaded every time the app start.
	initExtension() {
		this.getHardwareData();

		const valueObjects = {
			// cpu: 'model',
			cpuTemperature: 'main',
			currentLoad: 'currentLoad',
			// graphics: 'controllers',
			mem: 'used, total',
		};

		si.observe(valueObjects, 10000, this.sendDataValues.bind(this));
	}

	execute(action, args) {}

	async getHardwareData() {
		this.cpu = await si.cpu();
	}

	sendDataValues(data) {
		const { currentLoad, cpuTemperature, mem } = data;

		this.setValue({
			'si-load-cpu': {
				title: 'CPU Load',
				description: this.cpu.brand,
				value: currentLoad.currentLoad.toFixed(1),
				suffix: '%',
			},
			'si-temperature-cpu': {
				title: 'CPU Temperature',
				description: this.cpu.brand,
				value: cpuTemperature.main,
				suffix: '°C',
			},
			'si-load-p-ram': {
				title: 'RAM Usage',
				value: (mem.used / mem.total).toFixed(1),
				suffix: '%',
			},
			'si-load-gb-ram': {
				title: 'RAM Usage',
				value: (mem.used * Math.pow(10, -9)).toFixed(1),
				suffix: 'GB',
			},
		});
	}
}

module.exports = (sendData) => new SystemInfo(sendData);
