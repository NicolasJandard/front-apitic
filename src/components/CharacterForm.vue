<template>
	<div>
		<b-form ref="form" @submit.prevent="submit">
			<b-form-group label="Pseudo" label-for="input-pseudo" invalid-feedback="Un pseudo est requis">
				<b-form-input id="input-pseudo" v-model="$v.form.pseudo.$model" :state="validationState($v.form.pseudo)">
				</b-form-input>
			</b-form-group>
			<b-form-group label="Race" label-for="input-race">
				<b-form-select id="input-race" :options="races" value-field="id" text-field="name">
					<template v-slot:first>
						<option value="" disabled>- Sélectionnez votre race -</option>
					</template>
				</b-form-select>
			</b-form-group>
			<b-form-group label="Classe" label-for="input-job">
				<b-form-select id="input-job" :options="jobs" value-field="id" text-field="name">
					<template v-slot:first>
						<option value="" disabled>- Sélectionnez votre classe -</option>
					</template>
				</b-form-select>
			</b-form-group>
			<b-form-group label="Spécialisation" label-for="input-specialisation">
				<b-form-select id="input-specialisation" :options="specialisations" value-field="id" text-field="name">
					<template v-slot:first>
						<option value="" disabled>- TODO -</option>
					</template>
				</b-form-select>
			</b-form-group>
			<b-form-group label="Compétence préférée" label-for="input-skill">
				<b-form-select id="input-skill" :options="skills" value-field="id" text-field="name">
					<template v-slot:first>
						<option value="" disabled>- TODO -</option>
					</template>
				</b-form-select>
			</b-form-group>
			<b-form-group label="Points de vie" label-for="input-health" invalid-feedback="Un nombre positif de points de vie est requis">
				<b-form-input id="input-health" v-model="$v.form.health.$model" :state="validationState($v.form.health)">
				</b-form-input>
			</b-form-group>
			<b-form-group label="Type d'armure" label-for="input-armor">
				<b-form-select id="input-armor" :options="armors" value-field="id" text-field="name">
					<template v-slot:first>
						<option value="" disabled>- Sélectionnez votre type d'armure -</option>
					</template>
				</b-form-select>
			</b-form-group>
			<b-form-group label="Propriétaire" label-for="input-owner" invalid-feedback="Un nom est requis">
				<b-form-input id="input-owner" v-model="$v.form.owner.$model" :state="validationState($v.form.owner)">
				</b-form-input>
			</b-form-group>
			<b-button type="submit" variant="primary">Valider</b-button>
		</b-form>
	</div>
</template>

<script>
	import axios from 'axios'
	import { API_BASE_URL } from '../config'
	import { required, numeric } from 'vuelidate/lib/validators'

	export default {
		name: 'CharacterForm',
		data: () => ({
			form: {
				pseudo: '',
				race: '',
				job: '',
				specialisation: '',
				health: '',
				armor: '',
				skill: '',
				owner: '',
			},
			races: [],
			jobs: [],
			armors: [],
		}),
		validations: {
			form: {
				pseudo: { required },
				health: { required, numeric },
				owner: { required }
			}
		},

		async created() {
			try {
				const racesResponse = await axios.get(API_BASE_URL + '/races')
				this.races = racesResponse.data.data

				const jobsResponse = await axios.get(API_BASE_URL + '/jobs')
				this.jobs = jobsResponse.data.data

				const armorsResponse = await axios.get(API_BASE_URL + '/armors')
				this.armors = armorsResponse.data.data
			}
			catch(e) {
				console.log('cc')
			}
		},

		methods: {
			clearForm() {
				this.form.pseudo = ''
				this.form.health = ''
				this.form.owner = ''
				this.$nextTick(() => { this.$v.reset(); })
			},

			handleOk(event) {
				event.preventDefault()
				if(!this.$v.invalid) {
					this.handleSubmit()
				}
				else {
					this.$v.touch()
				}
			},

			validationState(item) {
				const { $dirty, $error } = item
				return $dirty ? !$error : null
			},

		}
	}
</script>