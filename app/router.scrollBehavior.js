import goTo from "vuetify/es5/services/goto";

export default (to, from, savedPosition) => {
	let target = 0;
	let offset = 0;

	if (to.hash) {
		if (to.hash.startsWith("#tab__")) {
			target = to.path == from.path && from.hash != "" ? "#tabs" : 0;
			offset = to.path == from.path && from.hash != "" ? 64 : 0;
		} else target = to.hash;
	}

	setTimeout(_ => goTo(target, { offset }), 5);
};
