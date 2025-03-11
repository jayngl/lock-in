export default function todoCard(goal, deadline) {
  return `<div
      class="flex justify-between items-center mx-5 md:mx-0 py-2 px-2 rounded-[.45rem] bg-gray-600 "
    >
      <div class="flex justify-center items center flex-row gap-x-3">
        <input type="checkbox" class="goalCheckBox" />
        <div class="">
          <h1 class="md:text-[1.4rem] text-[.8rem] text-white">${goal}</h1>
          <p class="md:text-[1rem] text-[.5rem] text-gray-400">${deadline}</p>
        </div>
      </div>

      <div class="flex justify-center items-start ">
        <button class="md:px-3 px-2 editBtn"><i class="fa-solid fa-square-pen md:text-2xl text-gray-400" title="edit goal"></i></button>
        <button class="md:px-3  px-2 deleteBtn"><i class="fa-solid fa-square-minus md:text-2xl text-gray-400" title="delete goal"></i></button>
      </div>
    </div>`;
}
