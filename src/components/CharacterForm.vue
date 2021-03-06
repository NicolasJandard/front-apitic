<template>
	<div>
		<b-form ref="form" @submit.prevent="submitForm">
			<b-form-group label="Pseudo" label-for="input-pseudo" invalid-feedback="Un pseudo est requis">
				<b-form-input id="input-pseudo" v-model="$v.form.pseudo.$model" :state="validationState($v.form.pseudo)">
				</b-form-input>
			</b-form-group>
			<b-form-group label="Race" label-for="input-race">
				<b-form-select id="input-race" :options="races" value-field="id" text-field="name" v-model="raceValue">
					<template v-slot:first>
						<option value="" disabled>- Sélectionnez votre race -</option>
					</template>
				</b-form-select>
			</b-form-group>
			<b-form-group label="Classe" label-for="input-job">
				<b-form-select id="input-job" :options="jobs" value-field="id" text-field="name" v-model="jobValue">
					<template v-slot:first>
						<option value="" disabled>- Sélectionnez votre classe -</option>
					</template>
				</b-form-select>
			</b-form-group>
			<b-form-group label="Spécialisation" label-for="input-specialisation">
				<b-form-select id="input-specialisation" :options="specialisations" value-field="id" text-field="name" v-model="speValue">
					<template v-slot:first>
						<option value="" disabled>- Sélectionnez votre spécialisation -</option>
					</template>
				</b-form-select>
			</b-form-group>
			<b-form-group label="Compétence préférée" label-for="input-skill">
				<b-form-select id="input-skill" :options="skills" value-field="id" text-field="name" v-model="skillValue">
					<template v-slot:first>
						<option value="" disabled>- Sélectionnez votre compétence -</option>
					</template>
				</b-form-select>
			</b-form-group>
			<b-form-group label="Points de vie" label-for="input-health" invalid-feedback="Un nombre positif de points de vie est requis">
				<b-form-input id="input-health" v-model="$v.form.health.$model" :state="validationState($v.form.health)">
				</b-form-input>
			</b-form-group>
			<b-form-group label="Type d'armure" label-for="input-armor">
				<b-form-select id="input-armor" :options="armors" value-field="id" text-field="name" v-model="armorValue">
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
		
		props: {
			charValues : Object
		},
		
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
			specialisations: [],
			skills: [],
			jobValue : 0,
			speValue : 0,
			raceValue : 0,
			armorValue : 0,
			skillValue : 0,
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

				if(this.charValues) {
					this.setDataFromParent()
				}
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

			getSelectedJob : function(jobValue) {
				this.specialisations = [];
				this.skills = [];
				var vm = this
				axios.get(API_BASE_URL + '/jobs/specialisations/' + jobValue).then(function(response) {
					vm.specialisations = response.data
					if(vm.charValues) {
						var speId = vm.findIn(vm.specialisations, specialisation => specialisation.name == vm.charValues.specialisation)
						if(speId >= 0) {
							vm.speValue = vm.specialisations[speId].id
						}
					}

				})
			},

			getSelectedSpecialisation : function(speValue) {
				this.skills = [];
				var vm = this
				axios.get(API_BASE_URL + '/specialisations/skills/' + speValue).then(function(response) {
					vm.skills = response.data
					if(vm.charValues) {
						var skillId = vm.findIn(vm.skills, skill => skill.name == vm.charValues.skill)
						if(skillId >= 0) {
							vm.skillValue = vm.skills[skillId].id
						}
					}
				})
			},

			submitForm() {
				this.$v.$touch
				var vm = this
				if(this.$v.$invalid) {
					alert("Nope")
				}
				else {
					var payload = this.createPayload();

					if(this.charValues) {
						axios.post(API_BASE_URL + '/characters/' + this.charValues.id , payload).then(function() {
							vm.$emit('change', 'refreshArray')
							alert("Personnage modifié")
						})
					}
					else {
						axios.post(API_BASE_URL + '/characters', payload).then(function() {
							vm.$emit('change', 'refreshArray')
							alert("Personnage ajouté")
						})
					}
				}
			},

			createPayload() {
				return {
					pseudo: this.$data.form.pseudo,
					race_id: this.raceValue,
					job_id: this.jobValue,
					specialisation_id: this.speValue,
					skill_id: this.skillValue,
					armor_id: this.armorValue,
					health: this.$data.form.health,
					owner: this.$data.form.owner
				}
			},

			setDataFromParent() {
				this.$data.form.pseudo = this.charValues.pseudo
				this.jobValue = this.jobs[this.findIn(this.jobs, job => job.name == this.charValues.job)].id
				this.raceValue = this.races[this.findIn(this.races, race => race.name == this.charValues.race)].id
				this.armorValue = this.armors[this.findIn(this.armors, armor => armor.name == this.charValues.armor)].id
				this.$data.form.health = this.charValues.health
				this.$data.form.owner = this.charValues.owner
			},

			findIn(array, condition) {
				const item = array.find(condition)
				return array.indexOf(item)
			}

		},

		watch: {
			jobValue: function(value) {
				this.getSelectedJob(value)
			},

			speValue: function(value) {
				this.getSelectedSpecialisation(value)
			}
		}
	}
</script>