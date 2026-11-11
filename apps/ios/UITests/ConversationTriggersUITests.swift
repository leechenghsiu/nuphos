import XCTest

final class ConversationTriggersUITests: XCTestCase {
    func testConversationTitleOpensTriggers() {
        let fixture = URL(filePath: #filePath)
            .deletingLastPathComponent().deletingLastPathComponent()
            .appending(path: "tests/fixtures/conversation-triggers-responses.json")
        let app = XCUIApplication()
        app.launchArguments = ["-preview-home", "-preview-no-push", "-AppleInterfaceStyle", "Light"]
        app.launchEnvironment = ["NUPHOS_PREVIEW_RESPONSES": fixture.path]
        app.launch()
        let conversation = app.staticTexts["Preview push-a"].firstMatch
        XCTAssertTrue(conversation.waitForExistence(timeout: 15))
        conversation.tap()
        let title = app.descendants(matching: .any)["conversation-trigger-entry"].firstMatch
        XCTAssertTrue(title.waitForExistence(timeout: 15))
        title.tap()
        XCTAssertTrue(app.staticTexts["Morning PR digest"].waitForExistence(timeout: 10))
        XCTAssertTrue(app.staticTexts["Production alerts"].exists)
        XCTAssertTrue(app.staticTexts["Weekly dependency review"].exists)
        let capture = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        capture.name = "triggers-2096-ios"
        capture.lifetime = .keepAlways
        add(capture)
    }
}
