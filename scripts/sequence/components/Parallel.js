define([
	'./BaseComponent',
	'core/ArrayUtilities',
], (
	BaseComponent,
	array
) => {
	'use strict';

	function nullableMax(a = null, b = null) {
		if(a === null) {
			return b;
		}
		if(b === null) {
			return a;
		}
		return Math.max(a, b);
	}

	function mergeResults(a, b) {
		array.mergeSets(a.agentNames, b.agentNames);
		return {
			topShift: Math.max(a.topShift, b.topShift),
			agentNames: a.agentNames,
			asynchronousY: nullableMax(a.asynchronousY, b.asynchronousY),
		};
	}

	class Parallel extends BaseComponent {
		separationPre(stage, env) {
			stage.stages.forEach((subStage) => {
				env.components.get(subStage.type).separationPre(subStage, env);
			});
		}

		separation(stage, env) {
			stage.stages.forEach((subStage) => {
				env.components.get(subStage.type).separation(subStage, env);
			});
		}

		renderPre(stage, env) {
			const baseResults = {
				topShift: 0,
				agentNames: [],
				asynchronousY: null,
			};

			return stage.stages.map((subStage) => {
				const component = env.components.get(subStage.type);
				const subResult = component.renderPre(subStage, env);
				return BaseComponent.cleanRenderPreResult(subResult);
			}).reduce(mergeResults, baseResults);
		}

		render(stage, env) {
			const originalMakeRegion = env.makeRegion;
			let bottomY = 0;
			stage.stages.forEach((subStage) => {
				env.makeRegion = (o, stageOverride = null) => {
					return originalMakeRegion(o, stageOverride || subStage);
				};

				const component = env.components.get(subStage.type);
				const baseY = component.render(subStage, env) || 0;
				bottomY = Math.max(bottomY, baseY);
			});
			env.makeRegion = originalMakeRegion;
			return bottomY;
		}
	}

	BaseComponent.register('parallel', new Parallel());

	return Parallel;
});
