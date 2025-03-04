# **Bold Cards** for Home Assistant
Beautiful and customizable cards for Home Assistant Lovelace UI.

## Roadmap

- [ ] (wip) Media Player Card
- [ ] Themperature Sensor Card
- [ ] Airquality Sensor Card
- [ ] Humidity Sensor Card
- [ ] Light Card
- [ ] Weather Card
- [ ] Glance Card
- [ ] Multi Media Player Card
- [ ] Occupancy Card

## Installation

> [!NOTE]
> This project is still in a very early stage so we only support building from source for now.

### Prerequisites
- Node.js and npm installed on your computer

### Building from source and installing
1. Clone this repository using git 
   `git clone https://github.com/mymakerofficial/ha-bold-cards.git`
2. Navigate to the cloned repository
   `cd ha-bold-cards`
3. Install the dependencies
   `npm install`
4. Build the project
   `npm run build`
5. Copy the `/dist/bold-cards.js` file from your computer to your Home Assistant's `/www` directory
    - If you don't have a `www` directory, create one in your Home Assistant's root directory
6. Add the module to your resources
   1. Settings -> Dashboards -> Resources (top right three dots) -> Add resource
   2. URL: `/local/bold-cards.js`
   3. Resource type: `module`
   4. Add
7. Refresh your browser
8. Enjoy!

## HACS
soon™
