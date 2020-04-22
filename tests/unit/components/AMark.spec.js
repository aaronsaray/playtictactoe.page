import { shallowMount } from "@vue/test-utils";
import AMark from "@/components/AMark.vue";
import { directive } from "@babel/types";

describe("AMark.vue", () => {
  it("renders no marks when nothing is indicated", () => {
    const wrapper = shallowMount(AMark, {
      propsData: {
        hasMark: false,
        mark: "o",
        enabled: true
      }
    });
    expect(wrapper.text()).toMatchSnapshot();
  });

  it.todo("has mark x shows x, no considering");
  it.todo("has mark o shows o, no considering");

  it.todo("is mark x and considering shows x with considering");
  it.todo("is mark o and considering shows o with considering");

  it("will not mark considering if not enabled", () => {
    const wrapper = shallowMount(AMark, {
      propsData: {
        hasMark: false,
        mark: "o",
        enabled: false
      }
    });

    const box = wrapper.find("div");
    box.trigger("mouseover");
    expect(wrapper.vm.considering).toBeFalsy();
  });

  it("will not mark considering if enabled but has mark", () => {
    const wrapper = shallowMount(AMark, {
      propsData: {
        hasMark: "o",
        mark: "o",
        enabled: true
      }
    });

    const box = wrapper.find("div");
    box.trigger("mouseover");
    expect(wrapper.vm.considering).toBeFalsy();
  });

  it("will mark considering if enabled and has no mark", () => {
    const wrapper = shallowMount(AMark, {
      propsData: {
        hasMark: null,
        mark: "o",
        enabled: true
      }
    });

    const box = wrapper.find("div");
    box.trigger("mouseover");
    expect(wrapper.vm.considering).toBeTruthy();
  });

  it("clears considering when mouse leave", () => {
    const wrapper = shallowMount(AMark, {
      propsData: {
        hasMark: null,
        mark: "o",
        enabled: true
      }
    });
    wrapper.setData({ considering: true });

    const box = wrapper.find("div");
    box.trigger("mouseleave");
    expect(wrapper.vm.considering).toBeFalsy();
  });

  it.todo("will not emit that it was chose if not enabled");
  it.todo("will not emit that it was chose if enabled but has a mark");
  it.todo(
    "will emit that it was chose, clear considering if enabled and no mark"
  );
});
